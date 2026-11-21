import { Injectable } from '@nestjs/common';
import { GeminiService } from '../../gemini/gemini.service';
import { MeetingContentService } from '../../meetings/meeting-content.service';
import { ChatAnswerRequest } from '../answer/chat-answer-request';
import { ChatReply } from '../answer/chat-reply';
import { ChatResponder } from '../answer/chat-responder';
import { snapMeetingCitations } from '../answer/meeting-citations';
import { parseAnswer } from '../answer/parse-answer';
import {
  buildMeetingChatInstruction,
  MeetingChatContext,
} from '../prompts/meeting-chat.prompt';

@Injectable()
export class MeetingChatResponder implements ChatResponder {
  constructor(
    private readonly content: MeetingContentService,
    private readonly gemini: GeminiService,
  ) {}

  async reply({
    thread,
    turns,
    signal,
    onPartial,
  }: ChatAnswerRequest): Promise<ChatReply> {
    if (!thread.meetingId) {
      throw new Error(`Chat ${thread.id} is not bound to a meeting`);
    }
    const context = await this.buildContext(thread.userId, thread.meetingId);
    const formatCitations = snapMeetingCitations(context.segments);

    const text = await this.gemini.streamText(
      buildMeetingChatInstruction(context),
      turns,
      (partial) => onPartial(parseAnswer(partial, formatCitations).content),
      { signal },
    );
    return parseAnswer(text, formatCitations);
  }

  private async buildContext(
    userId: string,
    meetingId: string,
  ): Promise<MeetingChatContext> {
    const [meeting, segments, keyPoints, actionItems] = await Promise.all([
      this.content.findOwned(userId, meetingId),
      this.content.getSegments(meetingId),
      this.content.getKeyPointTexts(meetingId),
      this.content.getActionItemTexts(meetingId),
    ]);

    return { title: meeting.title, segments, keyPoints, actionItems };
  }
}
