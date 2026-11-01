export interface ClaudeStreamLine {
  type: string;
  is_error?: boolean;
  result?: string;
  event?: {
    type: string;
    delta?: { type: string; text?: string };
  };
}
