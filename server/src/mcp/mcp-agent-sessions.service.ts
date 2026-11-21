import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { McpAgentSession } from './mcp-agent-session';
import { MCP_PATH } from './mcp-path';
import { McpSessionTokensService } from './mcp-session-tokens.service';

const MCP_SERVER_NAME = 'voicer';

@Injectable()
export class McpAgentSessionsService {
  private readonly url: string;

  constructor(
    private readonly sessionTokens: McpSessionTokensService,
    configService: ConfigService,
  ) {
    this.url = `http://127.0.0.1:${configService.get<number>('PORT')}/${MCP_PATH}`;
  }

  open(userId: string, ttlMs: number): McpAgentSession {
    const { token, revoke } = this.sessionTokens.issue(userId, ttlMs);

    return {
      mcpConfig: {
        mcpServers: {
          [MCP_SERVER_NAME]: {
            type: 'http',
            url: this.url,
            headers: { Authorization: `Bearer ${token}` },
          },
        },
      },
      allowedTools: [`mcp__${MCP_SERVER_NAME}`],
      ttlMs,
      close: revoke,
    };
  }
}
