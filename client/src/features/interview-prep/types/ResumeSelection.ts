export type ResumeSelection =
  | { kind: 'file'; file: File }
  | { kind: 'saved'; id: string };
