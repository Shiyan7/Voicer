export interface ClaudeAgentRequest {
  systemInstruction: string;
  prompt: string;
  mcpConfig: object;
  allowedTools: string[];
  timeoutMs: number;
}
