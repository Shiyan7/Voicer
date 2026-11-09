import type { TranscriptSegmentOutput } from '@schema';

import { TranscriptTextPart } from '../../../types/TranscriptTextPart';

export interface RecordingDeps {
  transcript: TranscriptSegmentOutput[];
  isLoading: boolean;
  currentTimeMs: number;
  focusId: string | null;
  currentMatchIndex: number | null;
  partsFor: (segmentId: string, text: string) => TranscriptTextPart[];
  isMatchCurrent: (index: number | null) => boolean;
  onSeek: (ms: number) => void;
}
