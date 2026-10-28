export type ChatInline =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'time'; ms: number; label: string };

export interface ChatBlock {
  isBullet: boolean;
  inlines: ChatInline[];
}
