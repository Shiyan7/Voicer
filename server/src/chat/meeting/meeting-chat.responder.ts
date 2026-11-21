import { Injectable } from '@nestjs/common';
import { GeminiService } from '../../gemini/gemini.service';
import { MeetingContentService } from '../../meetings/meeting-content.service';
import { ChatAnswerRequest } from '../answer/chat-answer-request';
import { ChatReply } from '../answer/chat-reply';
import { snapMeetingCitations } from '../answer/meeting-citations';
import { PartialReplyHandler, streamReply } from '../answer/stream-reply';
import {
  buildMeetingChatInstruction,
  MeetingChatContext,
} from '../prompts/meeting-chat.prompt';

@Injectable()
export class MeetingChatResponder {
  constructor(
    private readonly content: MeetingContentService,
    private readonly gemini: GeminiService,
  ) {}

  async reply(
    meetingId: string,
    request: ChatAnswerRequest,
    onPartial: PartialReplyHandler,
  ): Promise<ChatReply> {
    const context = await this.buildContext(request.userId, meetingId);

    return streamReply(
      (onText) =>
        this.gemini.streamText(
          buildMeetingChatInstruction(context),
          request.turns,
          onText,
          { signal: request.signal },
        ),
      snapMeetingCitations(context.segments),
      onPartial,
    );
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
