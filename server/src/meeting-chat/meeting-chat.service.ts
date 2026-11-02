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
import { GeminiService } from '../gemini/gemini.service';
import { LlmTurn } from '../llm/llm-turn';
import { MeetingContentService } from '../meetings/meeting-content.service';
import { MeetingEntity } from '../meetings/meeting.entity';
import { PUB_SUB } from '../pubsub/pubsub.module';
import { topic } from '../pubsub/topic';
import { ChatMessageEntity } from './chat-message.entity';
import { ChatMessageOutput } from './chat-message.output';
import { ChatRole } from './chat-role.enum';
import { toChatMessageOutput } from './meeting-chat.serializer';
import { MeetingQuestionsService } from './meeting-questions.service';
import {
  buildMeetingChatInstruction,
  MeetingChatContext,
  parseAnswer,
  snapCitations,
} from './prompts/meeting-chat.prompt';

const MAX_QUESTION_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 20;

const chatMessageTopic = (meetingId: string): string =>
  topic('meetingChatMessage', meetingId);

interface ChatMessagePayload {
  meetingChatMessage: ChatMessageOutput;
}

@Injectable()
export class MeetingChatService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MeetingChatService.name);
  private readonly answeringMeetings = new Set<string>();

  constructor(
    @InjectRepository(ChatMessageEntity)
    private readonly messagesRepository: Repository<ChatMessageEntity>,
    private readonly content: MeetingContentService,
    private readonly gemini: GeminiService,
    private readonly questions: MeetingQuestionsService,
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
    meetingId: string,
  ): Promise<ChatMessageOutput[]> {
    await this.content.findOwned(userId, meetingId);
    const messages = await this.messagesRepository.find({
      where: { meetingId },
      order: { createdAt: 'ASC' },
    });

    return messages.map((message) =>
      toChatMessageOutput(message, this.isStreaming(message)),
    );
  }

  async getSuggestions(userId: string, meetingId: string): Promise<string[]> {
    const meeting = await this.content.findOwned(userId, meetingId);
    return this.questions.getQuestions(
      meeting,
      await this.content.getSegments(meetingId),
    );
  }

  async ask(
    userId: string,
    meetingId: string,
    question: string,
  ): Promise<ChatMessageOutput> {
    const text = requireText(
      question,
      MAX_QUESTION_LENGTH,
      'Некорректный вопрос',
    );
    const meeting = await this.content.findOwned(userId, meetingId);
    if (this.answeringMeetings.has(meetingId)) {
      throw new BadRequestException('Дождитесь окончания ответа');
    }

    const history = await this.getHistory(meetingId);
    const userMessage = await this.saveMessage(meetingId, ChatRole.USER, text);
    const assistantMessage = await this.saveMessage(
      meetingId,
      ChatRole.ASSISTANT,
      '',
    );

    this.answeringMeetings.add(meetingId);
    void this.answer(
      meeting,
      [...history, { role: 'user', text }],
      assistantMessage,
    ).catch((error: unknown) => this.logFailure(meeting.id, error));

    return toChatMessageOutput(userMessage);
  }

  async clear(userId: string, meetingId: string): Promise<boolean> {
    await this.content.findOwned(userId, meetingId);
    if (this.answeringMeetings.has(meetingId)) {
      throw new BadRequestException('Дождитесь окончания ответа');
    }

    await this.messagesRepository.delete({ meetingId });
    return true;
  }

  async subscribe(
    userId: string,
    meetingId: string,
  ): Promise<AsyncIterator<ChatMessagePayload>> {
    await this.content.findOwned(userId, meetingId);

    return this.pubSub.asyncIterableIterator<ChatMessagePayload>(
      chatMessageTopic(meetingId),
    );
  }

  private async answer(
    meeting: MeetingEntity,
    turns: LlmTurn[],
    message: ChatMessageEntity,
  ): Promise<void> {
    try {
      Object.assign(message, await this.generateReply(meeting, turns, message));
    } catch (error) {
      this.logFailure(meeting.id, error);
      message.isFailed = true;
    }

    this.answeringMeetings.delete(meeting.id);
    await this.messagesRepository.save(message);
    await this.publish(message, false);
  }

  private async generateReply(
    meeting: MeetingEntity,
    turns: LlmTurn[],
    message: ChatMessageEntity,
  ): Promise<Pick<ChatMessageEntity, 'content' | 'followUps' | 'isFailed'>> {
    const context = await this.buildContext(meeting);
    const text = await this.gemini.streamText(
      buildMeetingChatInstruction(context),
      turns,
      (partial) =>
        this.publish(
          { ...message, content: parseAnswer(partial).answer },
          true,
        ),
    );
    const parsed = parseAnswer(text);
    const content = snapCitations(parsed.answer, context.segments);

    return { content, followUps: parsed.followUps, isFailed: !content };
  }

  private logFailure(meetingId: string, error: unknown): void {
    this.logger.error(
      `Failed to answer in meeting ${meetingId}`,
      describeError(error),
    );
  }

  private async buildContext(
    meeting: MeetingEntity,
  ): Promise<MeetingChatContext> {
    const [segments, keyPoints, actionItems] = await Promise.all([
      this.content.getSegments(meeting.id),
      this.content.getKeyPointTexts(meeting.id),
      this.content.getActionItemTexts(meeting.id),
    ]);

    return {
      title: meeting.title,
      segments,
      keyPoints,
      actionItems,
    };
  }

  private async getHistory(meetingId: string): Promise<LlmTurn[]> {
    const messages = await this.messagesRepository.find({
      where: { meetingId, isFailed: false },
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
    meetingId: string,
    role: ChatRole,
    content: string,
  ): Promise<ChatMessageEntity> {
    return this.messagesRepository.save(
      this.messagesRepository.create({ meetingId, role, content }),
    );
  }

  private async publish(
    message: ChatMessageEntity,
    isStreaming: boolean,
  ): Promise<void> {
    await this.pubSub.publish(chatMessageTopic(message.meetingId), {
      meetingChatMessage: toChatMessageOutput(message, isStreaming),
    });
  }

  private isStreaming(message: ChatMessageEntity): boolean {
    return (
      message.role === ChatRole.ASSISTANT &&
      !message.content &&
      !message.isFailed &&
      this.answeringMeetings.has(message.meetingId)
    );
  }
}
