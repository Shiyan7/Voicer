import { Injectable } from '@nestjs/common';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { MeetingsService } from '../../meetings/meetings.service';
import { MeetingsSort } from '../../meetings/meetings-sort.enum';
import { McpTool } from '../mcp-tool';
import { READ_ONLY_ANNOTATIONS } from '../read-only-annotations';
import { toMcpMeeting } from '../to-mcp-meeting';
import { toToolResult } from '../to-tool-result';

const inputSchema = {
  from: z.iso
    .datetime({ offset: true })
    .optional()
    .describe('Inclusive lower bound of meeting start, ISO 8601'),
  to: z.iso
    .datetime({ offset: true })
    .optional()
    .describe('Exclusive upper bound of meeting start, ISO 8601'),
  sources: z
    .array(z.string())
    .optional()
    .describe('Calling apps the meetings were recorded from'),
  favoritesOnly: z.boolean().default(false),
  sort: z.enum(MeetingsSort).default(MeetingsSort.DATE_DESC),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
};

@Injectable()
export class ListMeetingsTool implements McpTool {
  constructor(private readonly meetingsService: MeetingsService) {}

  register(server: McpServer, userId: string): void {
    server.registerTool(
      'list_meetings',
      {
        title: 'List meetings',
        description:
          'List recorded meetings, newest first by default, optionally within a date range or for specific calling apps.',
        inputSchema,
        annotations: READ_ONLY_ANNOTATIONS,
      },
      async ({ from, to, ...input }) => {
        const meetingsPage = await this.meetingsService.getUserMeetingsPage(
          userId,
          {
            ...input,
            from: from ? new Date(from) : null,
            to: to ? new Date(to) : null,
          },
        );

        return toToolResult({
          items: meetingsPage.items.map(toMcpMeeting),
          meta: meetingsPage.meta,
        });
      },
    );
  }
}
