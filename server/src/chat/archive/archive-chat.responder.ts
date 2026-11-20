import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClaudeService } from '../../claude/claude.service';
import { McpSessionTokensService } from '../../mcp/mcp-session-tokens.service';
import { normalizeArchiveCitations } from '../answer/archive-citations';
import { ChatAnswerRequest } from '../answer/chat-answer-request';
import { ChatReply } from '../answer/chat-reply';
import { toChatReply } from '../answer/stream-reply';
import {
  buildArchiveChatInstruction,
  buildArchiveChatPrompt,
} from '../prompts/archive-chat.prompt';

const MCP_SERVER_NAME = 'voicer';
const AGENT_TIMEOUT_MS = 300_000;

@Injectable()
export class ArchiveChatResponder {
  private readonly mcpUrl: string;

  constructor(
    private readonly claude: ClaudeService,
    private readonly sessionTokens: McpSessionTokensService,
    configService: ConfigService,
  ) {
    this.mcpUrl = `http://127.0.0.1:${configService.get<number>('PORT')}/mcp`;
  }

  async reply(request: ChatAnswerRequest): Promise<ChatReply> {
    const session = this.sessionTokens.issue(request.userId, AGENT_TIMEOUT_MS);

    try {
      const text = await this.claude.runAgent(
        {
          systemInstruction: buildArchiveChatInstruction(new Date()),
          prompt: buildArchiveChatPrompt(request.turns),
          mcpConfig: this.buildMcpConfig(session.token),
          allowedTools: [`mcp__${MCP_SERVER_NAME}`],
          timeoutMs: AGENT_TIMEOUT_MS,
        },
        request.signal,
      );
      return toChatReply(text, normalizeArchiveCitations);
    } finally {
      session.revoke();
    }
  }

  private buildMcpConfig(token: string): object {
    return {
      mcpServers: {
        [MCP_SERVER_NAME]: {
          type: 'http',
          url: this.mcpUrl,
          headers: { Authorization: `Bearer ${token}` },
        },
      },
    };
  }
}
