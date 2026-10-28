import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { Repository } from 'typeorm';
import { ActionItemEntity } from '../actions/action-item.entity';
import { GeminiService } from '../gemini/gemini.service';
import { GeminiTurn } from '../gemini/gemini.types';
import { KeyPointEntity } from '../meetings/key-point.entity';
import { MeetingEntity } from '../meetings/meeting.entity';
import { TranscriptSegmentEntity } from '../meetings/transcript-segment.entity';
import { PUB_SUB } from '../pubsub/pubsub.module';
import { SummarizationService } from '../summarization/summarization.service';
import { TranscribedSegment } from '../transcription/transcription.types';
import { ChatMessageEntity } from './chat-message.entity';
import { ChatMessageOutput } from './chat-message.output';
import { ChatRole } from './chat-role.enum';
import { toChatMessageOutput } from './chat.serializer';
import { MeetingChatOutput } from './meeting-chat.output';
import {
  buildMeetingChatInstruction,
  MeetingChatContext,
  parseAnswer,
  ParsedAnswer,
} from './prompts/meeting-chat.prompt';

const MAX_QUESTION_LENGTH = 2000;

const chatMessageTopic = (meetingId: string): string =>
  `meetingChatMessage.${meetingId}`;

interface ChatMessagePayload {
  meetingChatMessage: ChatMessageOutput;
}

@Injectable()
export class MeetingChatService {
  private readonly logger = new Logger(MeetingChatService.name);
  private readonly answeringMeetings = new Set<string>();

  constructor(
    @InjectRepository(MeetingEntity)
    private readonly meetingsRepository: Repository<MeetingEntity>,
    @InjectRepository(ChatMessageEntity)
    private readonly messagesRepository: Repository<ChatMessageEntity>,
    @InjectRepository(TranscriptSegmentEntity)
    private readonly segmentsRepository: Repository<TranscriptSegmentEntity>,
    @InjectRepository(KeyPointEntity)
    private readonly keyPointsRepository: Repository<KeyPointEntity>,
    @InjectRepository(ActionItemEntity)
    private readonly actionItemsRepository: Repository<ActionItemEntity>,
    private readonly gemini: GeminiService,
    private readonly summarization: SummarizationService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async getChat(userId: string, meetingId: string): Promise<MeetingChatOutput> {
    const meeting = await this.findOwnedMeeting(userId, meetingId);
    const messages = await this.messagesRepository.find({
      where: { meetingId },
      order: { createdAt: 'ASC' },
    });

    return {
      messages: messages.map((message) =>
        toChatMessageOutput(message, this.isStreaming(message)),
      ),
      suggestedQuestions: await this.ensureSuggestedQuestions(meeting),
    };
  }

  async ask(
    userId: string,
    meetingId: string,
    question: string,
  ): Promise<ChatMessageOutput> {
    const text = this.validateQuestion(question);
    const meeting = await this.findOwnedMeeting(userId, meetingId);
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
    );

    return toChatMessageOutput(userMessage);
  }

  async clear(userId: string, meetingId: string): Promise<boolean> {
    await this.findOwnedMeeting(userId, meetingId);
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
    await this.findOwnedMeeting(userId, meetingId);

    return this.pubSub.asyncIterableIterator<ChatMessagePayload>(
      chatMessageTopic(meetingId),
    );
  }

  private async answer(
    meeting: MeetingEntity,
    turns: GeminiTurn[],
    message: ChatMessageEntity,
  ): Promise<void> {
    try {
      const instruction = buildMeetingChatInstruction(
        await this.buildContext(meeting),
      );
      const parsed = await this.generateAnswer(instruction, turns, message);
      Object.assign(message, {
        content: parsed.answer,
        followUps: parsed.followUps,
        isFailed: !parsed.answer,
      });
    } catch (error) {
      this.logger.error(
        `Failed to answer in meeting ${meeting.id}`,
        error instanceof Error ? error.stack : String(error),
      );
      message.isFailed = true;
    }

    this.answeringMeetings.delete(meeting.id);
    await this.messagesRepository.save(message);
    await this.publish(message, false);
  }

  private async generateAnswer(
    instruction: string,
    turns: GeminiTurn[],
    message: ChatMessageEntity,
  ): Promise<ParsedAnswer> {
    const text = await this.gemini.streamText(instruction, turns, (partial) =>
      this.publish({ ...message, content: parseAnswer(partial).answer }, true),
    );
    return parseAnswer(text);
  }

  private async buildContext(
    meeting: MeetingEntity,
  ): Promise<MeetingChatContext> {
    const [segments, keyPoints, actionItems] = await Promise.all([
      this.getSegments(meeting.id),
      this.keyPointsRepository.find({
        where: { meetingId: meeting.id },
        order: { order: 'ASC' },
      }),
      this.actionItemsRepository.find({ where: { meetingId: meeting.id } }),
    ]);

    return {
      title: meeting.title,
      segments,
      keyPoints: keyPoints.map((keyPoint) => keyPoint.text),
      actionItems: actionItems.map((actionItem) => actionItem.text),
    };
  }

  private async ensureSuggestedQuestions(
    meeting: MeetingEntity,
  ): Promise<string[]> {
    if (meeting.suggestedQuestions?.length) return meeting.suggestedQuestions;

    const segments = await this.getSegments(meeting.id);
    if (!segments.length) return [];

    try {
      const suggestedQuestions =
        await this.summarization.generateQuestions(segments);
      await this.meetingsRepository.update(meeting.id, { suggestedQuestions });
      return suggestedQuestions;
    } catch {
      this.logger.warn(`Failed to suggest questions for ${meeting.id}`);
      return [];
    }
  }

  private async getHistory(meetingId: string): Promise<GeminiTurn[]> {
    const messages = await this.messagesRepository.find({
      where: { meetingId, isFailed: false },
      order: { createdAt: 'ASC' },
    });

    return messages
      .filter((message) => message.content)
      .map((message) => ({
        role: message.role === ChatRole.USER ? 'user' : 'model',
        text: message.content,
      }));
  }

  private async getSegments(meetingId: string): Promise<TranscribedSegment[]> {
    const segments = await this.segmentsRepository.find({
      where: { meetingId },
      order: { startMs: 'ASC' },
    });

    return segments.map(({ speakerIndex, startMs, endMs, text }) => ({
      speakerIndex,
      startMs,
      endMs,
      text,
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

  private validateQuestion(question: string): string {
    const text = question.trim();
    if (!text || text.length > MAX_QUESTION_LENGTH) {
      throw new BadRequestException('Некорректный вопрос');
    }
    return text;
  }

  private async findOwnedMeeting(
    userId: string,
    meetingId: string,
  ): Promise<MeetingEntity> {
    const meeting = await this.meetingsRepository.findOneBy({
      id: meetingId,
      userId,
    });
    if (!meeting) throw new NotFoundException('Встреча не найдена');
    return meeting;
  }
}
