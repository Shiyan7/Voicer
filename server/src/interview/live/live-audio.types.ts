export type LiveServerMessage =
  | {
      type: 'transcript';
      utteranceId: number;
      text: string;
    }
  | { type: 'utteranceEnd'; utteranceId: number }
  | { type: 'answerStarted'; utteranceId: number; answerId: string };

export interface LiveClientMessage {
  type: 'answerNow';
}

export type MockServerMessage =
  | { type: 'thinking' }
  | {
      type: 'interviewerSpeech';
      text: string;
      language: string;
      audio: string | null;
    }
  | { type: 'transcript'; text: string }
  | { type: 'stopSpeaking' }
  | { type: 'interviewerFailed' };

export interface MockClientMessage {
  type: 'speechEnded';
}
