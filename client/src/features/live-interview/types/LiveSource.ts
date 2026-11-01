import { LiveAnswerUpdate } from './LiveAnswerUpdate';
import { LiveStatus } from './LiveStatus';
import { LiveTranscriptEvent } from './LiveTranscriptEvent';

export type Unsubscribe = () => void;

export interface LiveSource {
  start: () => void;
  stop: () => void;
  requestAnswer: () => void;
  captureCode: () => void;
  onTranscript: (listener: (event: LiveTranscriptEvent) => void) => Unsubscribe;
  onAnswer: (listener: (update: LiveAnswerUpdate) => void) => Unsubscribe;
  onStatus: (listener: (status: LiveStatus) => void) => Unsubscribe;
}
