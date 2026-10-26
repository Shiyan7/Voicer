import { MeetingDetails } from '@/entities/meeting';
import type { SpeakerTone } from '@/shared/ui/speaker-avatar';

export interface DetailsHeaderDeps {
  meeting: MeetingDetails;
  speakerTones: SpeakerTone[];
  onBack: () => void;
}
