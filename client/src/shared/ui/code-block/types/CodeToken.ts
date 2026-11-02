export type CodeTokenKind =
  | 'keyword'
  | 'string'
  | 'number'
  | 'comment'
  | 'type'
  | 'call'
  | 'plain';

export interface CodeToken {
  kind: CodeTokenKind;
  text: string;
}
