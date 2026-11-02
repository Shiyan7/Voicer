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
