import { Injectable } from '@nestjs/common';
import { ClaudeService } from '../../claude/claude.service';
import { McpAgentSessionsService } from '../../mcp/mcp-agent-sessions.service';
import { normalizeArchiveCitations } from '../answer/archive-citations';
import { ChatAnswerRequest } from '../answer/chat-answer-request';
import { ChatReply } from '../answer/chat-reply';
import { ChatResponder } from '../answer/chat-responder';
import { parseAnswer } from '../answer/parse-answer';
import {
  buildArchiveChatInstruction,
  buildArchiveChatPrompt,
} from '../prompts/archive-chat.prompt';

const AGENT_TIMEOUT_MS = 300_000;

@Injectable()
export class ArchiveChatResponder implements ChatResponder {
  constructor(
    private readonly claude: ClaudeService,
    private readonly mcpSessions: McpAgentSessionsService,
  ) {}

  async reply({
    thread,
    turns,
    signal,
  }: ChatAnswerRequest): Promise<ChatReply> {
    const session = this.mcpSessions.open(thread.userId, AGENT_TIMEOUT_MS);

    try {
      const text = await this.claude.runAgent(
        {
          systemInstruction: buildArchiveChatInstruction(new Date()),
          prompt: buildArchiveChatPrompt(turns),
          mcpConfig: session.mcpConfig,
          allowedTools: session.allowedTools,
          timeoutMs: session.ttlMs,
        },
        signal,
      );
      return parseAnswer(text, normalizeArchiveCitations);
    } finally {
      session.close();
    }
  }
}
