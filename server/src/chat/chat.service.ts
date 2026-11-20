import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { Repository } from 'typeorm';
import { describeError } from '../common/describe-error';
import { requireText } from '../common/require-text';
import { LlmTurn } from '../llm/llm-turn';
import { PUB_SUB } from '../pubsub/pubsub.module';
import { topic } from '../pubsub/topic';
import { ChatAnswerRequest } from './answer/chat-answer-request';
import { ChatReply } from './answer/chat-reply';
import { ArchiveChatResponder } from './archive/archive-chat.responder';
import { ChatMessageEntity } from './chat-message.entity';
import { ChatMessageOutput } from './chat-message.output';
import { toChatMessageOutput } from './chat-message.serializer';
import { ChatRole } from './chat-role.enum';
import { MeetingChatResponder } from './meeting/meeting-chat.responder';
import { ChatThreadEntity } from './threads/chat-thread.entity';
import { ChatThreadsService } from './threads/chat-threads.service';

const MAX_QUESTION_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 20;
const BUSY_MESSAGE = 'Дождитесь окончания ответа';

const chatMessageTopic = (threadId: string): string =>
  topic('chatMessage', threadId);

const FAILED_REPLY: ChatReply = { content: '', followUps: [] };

interface ChatMessagePayload {
  chatMessage: ChatMessageOutput;
}

@Injectable()
export class ChatService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ChatService.name);
  private readonly answering = new Map<string, AbortController>();

  constructor(
    @InjectRepository(ChatMessageEntity)
    private readonly messagesRepository: Repository<ChatMessageEntity>,
    private readonly threads: ChatThreadsService,
    private readonly meetingResponder: MeetingChatResponder,
    private readonly archiveResponder: ArchiveChatResponder,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.messagesRepository.update(
      { role: ChatRole.ASSISTANT, content: '', isFailed: false },
      { isFailed: true },
    );
  }

  async getMessages(
    userId: string,
    threadId: string,
  ): Promise<ChatMessageOutput[]> {
    await this.threads.findOwned(userId, threadId);
    const messages = await this.messagesRepository.find({
      where: { threadId },
      order: { createdAt: 'ASC' },
    });

    return messages.map((message) =>
      toChatMessageOutput(message, this.isStreaming(message)),
    );
  }

  async ask(
    userId: string,
    threadId: string,
    question: string,
  ): Promise<ChatMessageOutput> {
    const text = requireText(
      question,
      MAX_QUESTION_LENGTH,
      'Некорректный вопрос',
    );
    const thread = await this.threads.findOwned(userId, threadId);
    if (this.answering.has(threadId)) {
      throw new BadRequestException(BUSY_MESSAGE);
    }

    const history = await this.getHistory(threadId);
    const userMessage = await this.saveMessage(threadId, ChatRole.USER, text);
    const assistantMessage = await this.saveMessage(
      threadId,
      ChatRole.ASSISTANT,
      '',
    );
    await this.threads.touch(thread, text);

    const controller = new AbortController();
    this.answering.set(threadId, controller);
    void this.answer(
      thread,
      [...history, { role: 'user', text }],
      assistantMessage,
      controller.signal,
    ).catch((error: unknown) => this.logFailure(threadId, error));

    return toChatMessageOutput(userMessage);
  }

  async clear(userId: string, threadId: string): Promise<boolean> {
    await this.threads.findOwned(userId, threadId);
    this.cancel(threadId);
    await this.messagesRepository.delete({ threadId });
    return true;
  }

  async deleteThread(userId: string, threadId: string): Promise<boolean> {
    const thread = await this.threads.findOwned(userId, threadId);
    this.cancel(threadId);
    await this.threads.delete(thread);
    return true;
  }

  async subscribe(
    userId: string,
    threadId: string,
  ): Promise<AsyncIterator<ChatMessagePayload>> {
    await this.threads.findOwned(userId, threadId);

    return this.pubSub.asyncIterableIterator<ChatMessagePayload>(
      chatMessageTopic(threadId),
    );
  }

  private async answer(
    thread: ChatThreadEntity,
    turns: LlmTurn[],
    message: ChatMessageEntity,
    signal: AbortSignal,
  ): Promise<void> {
    const reply = await this.respond(thread, {
      userId: thread.userId,
      turns,
      signal,
      onPartial: (content) => this.publishPartial(message, content, signal),
    }).catch((error: unknown) => this.toFailedReply(thread.id, error, signal));
    if (signal.aborted) return;

    this.answering.delete(thread.id);
    Object.assign(message, reply, { isFailed: !reply.content });
    await this.messagesRepository.save(message);
    await this.publish(message, false);
  }

  private respond(
    thread: ChatThreadEntity,
    request: ChatAnswerRequest,
  ): Promise<ChatReply> {
    return thread.meetingId
      ? this.meetingResponder.reply(thread.meetingId, request)
      : this.archiveResponder.reply(request);
  }

  private toFailedReply(
    threadId: string,
    error: unknown,
    signal: AbortSignal,
  ): ChatReply {
    if (!signal.aborted) this.logFailure(threadId, error);
    return FAILED_REPLY;
  }

  private logFailure(threadId: string, error: unknown): void {
    this.logger.error(
      `Failed to answer in chat ${threadId}`,
      describeError(error),
    );
  }

  private cancel(threadId: string): void {
    this.answering.get(threadId)?.abort();
    this.answering.delete(threadId);
  }

  private async getHistory(threadId: string): Promise<LlmTurn[]> {
    const messages = await this.messagesRepository.find({
      where: { threadId, isFailed: false },
      order: { createdAt: 'DESC' },
      take: MAX_HISTORY_MESSAGES,
    });

    return messages
      .reverse()
      .filter((message) => message.content)
      .map((message) => ({
        role: message.role === ChatRole.USER ? 'user' : 'model',
        text: message.content,
      }));
  }

  private saveMessage(
    threadId: string,
    role: ChatRole,
    content: string,
  ): Promise<ChatMessageEntity> {
    return this.messagesRepository.save(
      this.messagesRepository.create({ threadId, role, content }),
    );
  }

  private async publishPartial(
    message: ChatMessageEntity,
    content: string,
    signal: AbortSignal,
  ): Promise<void> {
    if (signal.aborted) return;
    await this.publish({ ...message, content }, true);
  }

  private async publish(
    message: ChatMessageEntity,
    isStreaming: boolean,
  ): Promise<void> {
    await this.pubSub.publish(chatMessageTopic(message.threadId), {
      chatMessage: toChatMessageOutput(message, isStreaming),
    });
  }

  private isStreaming(message: ChatMessageEntity): boolean {
    return (
      message.role === ChatRole.ASSISTANT &&
      !message.content &&
      !message.isFailed &&
      this.answering.has(message.threadId)
    );
  }
}
