export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqStreamChunk {
  choices?: { delta?: { content?: string } }[];
}
