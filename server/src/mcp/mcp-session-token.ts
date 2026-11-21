export interface McpSessionToken {
  token: string;
  revoke: () => void;
}
