export type LiveServerMessage =
  | {
      type: 'transcript';
      utteranceId: number;
      text: string;
      isFinal: boolean;
      speechFinal: boolean;
    }
  | { type: 'utteranceEnd'; utteranceId: number }
  | { type: 'answerStarted'; utteranceId: number; answerId: string };

export interface LiveClientMessage {
  type: 'answerNow';
}
