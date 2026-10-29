import { Injectable } from '@nestjs/common';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ActionsService } from '../../actions/actions.service';
import { MeetingsService } from '../../meetings/meetings.service';
import { McpTool } from '../mcp-tool';
import { READ_ONLY_ANNOTATIONS } from '../read-only-annotations';
import { toMcpMeeting } from '../to-mcp-meeting';
import { toToolResult } from '../to-tool-result';

const inputSchema = {
  meetingId: z.uuid(),
};

@Injectable()
export class GetMeetingTool implements McpTool {
  constructor(
    private readonly meetingsService: MeetingsService,
    private readonly actionsService: ActionsService,
  ) {}

  register(server: McpServer, userId: string): void {
    server.registerTool(
      'get_meeting',
      {
        title: 'Get meeting notes',
        description:
          'AI notes of one meeting: metadata, key points and action items with offsets atMs. Use get_transcript for the verbatim text.',
        inputSchema,
        annotations: READ_ONLY_ANNOTATIONS,
      },
      async ({ meetingId }) => {
        const [meeting, keyPoints, actionItems] = await Promise.all([
          this.meetingsService.getMeeting(userId, meetingId),
          this.meetingsService.getMeetingKeyPoints(userId, meetingId),
          this.actionsService.getMeetingActionItems(userId, meetingId),
        ]);

        return toToolResult({
          ...toMcpMeeting(meeting),
          keyPoints: keyPoints.map(({ text, atMs }) => ({ text, atMs })),
          actionItems: actionItems.map(({ id, text, isDone, atMs }) => ({
            id,
            text,
            isDone,
            atMs,
          })),
        });
      },
    );
  }
}
