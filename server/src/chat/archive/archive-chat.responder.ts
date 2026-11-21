import { Injectable } from '@nestjs/common';
import { ClaudeService } from '../../claude/claude.service';
import { McpAgentSessionsService } from '../../mcp/mcp-agent-sessions.service';
import { normalizeArchiveCitations } from '../answer/archive-citations';
import { ChatAnswerRequest } from '../answer/chat-answer-request';
import { ChatReply } from '../answer/chat-reply';
import { toChatReply } from '../answer/to-chat-reply';
import {
  buildArchiveChatInstruction,
  buildArchiveChatPrompt,
} from '../prompts/archive-chat.prompt';

const AGENT_TIMEOUT_MS = 300_000;

@Injectable()
export class ArchiveChatResponder {
  constructor(
    private readonly claude: ClaudeService,
    private readonly mcpSessions: McpAgentSessionsService,
  ) {}

  async reply(request: ChatAnswerRequest): Promise<ChatReply> {
    const session = this.mcpSessions.open(request.userId, AGENT_TIMEOUT_MS);

    try {
      const text = await this.claude.runAgent(
        {
          systemInstruction: buildArchiveChatInstruction(new Date()),
          prompt: buildArchiveChatPrompt(request.turns),
          mcpConfig: session.mcpConfig,
          allowedTools: session.allowedTools,
          timeoutMs: AGENT_TIMEOUT_MS,
        },
        request.signal,
      );
      return toChatReply(text, normalizeArchiveCitations);
    } finally {
      session.close();
    }
  }
}
