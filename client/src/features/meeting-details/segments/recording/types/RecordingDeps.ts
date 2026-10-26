import type { TranscriptSegmentOutput } from '@schema';

export interface RecordingDeps {
  transcript: TranscriptSegmentOutput[];
  isLoading: boolean;
  currentTimeMs: number;
  onSeek: (ms: number) => void;
}
