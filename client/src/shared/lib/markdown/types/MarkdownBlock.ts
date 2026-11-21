export interface MarkdownTime {
  kind: 'time';
  ms: number;
  meetingId?: string;
}

export type MarkdownInline =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; text: string }
  | { kind: 'code'; text: string }
  | MarkdownTime;

export interface MarkdownBlock {
  isBullet: boolean;
  inlines: MarkdownInline[];
}
