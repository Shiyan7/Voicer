import type { SpeakerTone } from '@/shared/ui/speaker-avatar';

interface TranscriptParagraphView {
  id: string;
  text: string;
  startMs: number;
  endMs: number;
  isFocused: boolean;
}

export interface TranscriptSegmentView {
  id: string;
  speakerIndex: number;
  speakerLabel: string;
  tone: SpeakerTone;
  timeLabel: string;
  startMs: number;
  paragraphs: TranscriptParagraphView[];
}
