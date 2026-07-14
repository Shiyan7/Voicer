import { Speaker } from '@/entities/meeting';

export interface TranscriptSegmentView {
  id: string;
  speaker: Speaker;
  speakerLabel: string;
  timeLabel: string;
  text: string;
  isActive: boolean;
  startMs: number;
}
