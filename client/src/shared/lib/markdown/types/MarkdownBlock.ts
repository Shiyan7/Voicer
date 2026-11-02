export type MarkdownInline =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'time'; ms: number };

export interface MarkdownBlock {
  isBullet: boolean;
  inlines: MarkdownInline[];
}
