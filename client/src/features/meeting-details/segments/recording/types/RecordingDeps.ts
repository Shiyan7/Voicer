import type { TranscriptSegmentOutput } from '@schema';

export interface RecordingDeps {
  transcript: TranscriptSegmentOutput[];
  isLoading: boolean;
  currentTimeMs: number;
  focusId: string | null;
  onSeek: (ms: number) => void;
}
