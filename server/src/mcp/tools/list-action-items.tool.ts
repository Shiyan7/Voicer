import { Injectable } from '@nestjs/common';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ActionsService } from '../../actions/actions.service';
import { McpTool } from '../mcp-tool';
import { READ_ONLY_ANNOTATIONS } from '../read-only-annotations';
import { toToolResult } from '../to-tool-result';

const IS_DONE_BY_STATUS = { open: false, done: true, all: undefined };

const inputSchema = {
  status: z.enum(['open', 'done', 'all']).default('open'),
  limit: z.number().int().min(1).max(200).default(50),
};

@Injectable()
export class ListActionItemsTool implements McpTool {
  constructor(private readonly actionsService: ActionsService) {}

  register(server: McpServer, userId: string): void {
    server.registerTool(
      'list_action_items',
      {
        title: 'List action items',
        description:
          'Action items extracted from all meetings, newest first, with the meeting they came from.',
        inputSchema,
        annotations: READ_ONLY_ANNOTATIONS,
      },
      async ({ status, limit }) => {
        const actionItems = await this.actionsService.getUserActionItems(
          userId,
          IS_DONE_BY_STATUS[status],
        );

        return toToolResult({
          total: actionItems.length,
          items: actionItems.slice(0, limit),
        });
      },
    );
  }
}
