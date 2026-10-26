import type { SpeakerTone } from '@/shared/ui/speaker-avatar';

export type ActionItemData = {
  id: string;
  meetingId: string;
  text: string;
  isDone: boolean;
  createdAt: string;
  meetingTitle: string;
  speakerLabel?: string;
  speakerTone?: SpeakerTone;
  timeLabel?: string;
  isFocused: boolean;
};
