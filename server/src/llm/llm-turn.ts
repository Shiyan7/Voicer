export interface LlmInlineImage {
  mimeType: string;
  data: string;
}

export interface LlmTurn {
  role: 'user' | 'model';
  text: string;
  images?: LlmInlineImage[];
}
