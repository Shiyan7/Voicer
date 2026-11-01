export type CodeTokenKind =
  | 'keyword'
  | 'string'
  | 'number'
  | 'comment'
  | 'plain';

export interface CodeToken {
  kind: CodeTokenKind;
  text: string;
}
