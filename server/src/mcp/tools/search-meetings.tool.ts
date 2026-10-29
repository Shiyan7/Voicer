import { Injectable } from '@nestjs/common';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { SearchService } from '../../search/search.service';
import { SearchSort } from '../../search/search-sort.enum';
import { McpTool } from '../mcp-tool';
import { READ_ONLY_ANNOTATIONS } from '../read-only-annotations';
import { toToolResult } from '../to-tool-result';

const inputSchema = {
  query: z.string().min(2).describe('Words to find, all of them must match'),
  sort: z.enum(SearchSort).default(SearchSort.RELEVANCE),
  limit: z.number().int().min(1).max(50).default(10),
  offset: z.number().int().min(0).default(0),
};

@Injectable()
export class SearchMeetingsTool implements McpTool {
  constructor(private readonly searchService: SearchService) {}

  register(server: McpServer, userId: string): void {
    server.registerTool(
      'search_meetings',
      {
        title: 'Search meetings',
        description:
          'Full-text search across meeting titles, transcripts, key points and action items. Returns the best match per meeting with its offset atMs. Pass meetingId to get_meeting or get_transcript for details.',
        inputSchema,
        annotations: READ_ONLY_ANNOTATIONS,
      },
      async (input) =>
        toToolResult(await this.searchService.search(userId, input)),
    );
  }
}
