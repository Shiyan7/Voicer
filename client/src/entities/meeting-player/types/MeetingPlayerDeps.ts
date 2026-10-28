import type { TranscriptSegmentOutput } from '@schema';

import { PlaybackController } from './PlaybackController';

export interface MeetingPlayerDeps {
  audioUrl: string;
  transcript: TranscriptSegmentOutput[];
  playback: PlaybackController;
  rootRef?: (element: HTMLElement) => void;
}
