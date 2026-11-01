export interface GeminiInlineImage {
  mimeType: string;
  data: string;
}

export interface GeminiTurn {
  role: 'user' | 'model';
  text: string;
  images?: GeminiInlineImage[];
}
