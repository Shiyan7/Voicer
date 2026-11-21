export interface McpAgentSession {
  mcpConfig: object;
  allowedTools: string[];
  ttlMs: number;
  close: () => void;
}
