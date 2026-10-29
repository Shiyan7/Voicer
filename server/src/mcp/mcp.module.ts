import { Module } from '@nestjs/common';
import { ActionsModule } from '../actions/actions.module';
import { ApiTokensModule } from '../api-tokens/api-tokens.module';
import { MeetingsModule } from '../meetings/meetings.module';
import { SearchModule } from '../search/search.module';
import { McpAuthGuard } from './mcp-auth.guard';
import { McpController } from './mcp.controller';
import { McpServerFactory } from './mcp-server.factory';
import { GetMeetingTool } from './tools/get-meeting.tool';
import { GetTranscriptTool } from './tools/get-transcript.tool';
import { ListActionItemsTool } from './tools/list-action-items.tool';
import { ListMeetingsTool } from './tools/list-meetings.tool';
import { SearchMeetingsTool } from './tools/search-meetings.tool';

@Module({
  imports: [ApiTokensModule, MeetingsModule, SearchModule, ActionsModule],
  controllers: [McpController],
  providers: [
    McpAuthGuard,
    McpServerFactory,
    SearchMeetingsTool,
    ListMeetingsTool,
    GetMeetingTool,
    GetTranscriptTool,
    ListActionItemsTool,
  ],
})
export class McpModule {}
