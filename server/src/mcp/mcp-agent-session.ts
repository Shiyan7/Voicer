export interface McpAgentSession {
  mcpConfig: object;
  allowedTools: string[];
  close: () => void;
}
