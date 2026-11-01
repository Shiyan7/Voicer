export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqStreamChunk {
  choices?: { delta?: { content?: string } }[];
}

export interface GroqCompletion {
  choices: { message: { content: string } }[];
}
