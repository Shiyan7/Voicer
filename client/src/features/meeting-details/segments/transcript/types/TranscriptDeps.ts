import { TranscriptSegment } from '@/entities/meeting';

export interface TranscriptDeps {
  segments: TranscriptSegment[];
  currentTimeMs: number;
  onSeek: (startMs: number) => void;
}
