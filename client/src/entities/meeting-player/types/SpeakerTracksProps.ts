import { SpeakerTrack } from './SpeakerTrack';

export interface SpeakerTracksProps {
  tracks: SpeakerTrack[];
  onSeek: (ms: number) => void;
}
