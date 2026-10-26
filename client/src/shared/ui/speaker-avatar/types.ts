export type SpeakerTone =
  | 'violet'
  | 'amber'
  | 'sky'
  | 'rose'
  | 'emerald'
  | 'orange'
  | 'teal'
  | 'fuchsia'
  | 'indigo'
  | 'lime'
  | 'cyan'
  | 'stone';

export interface SpeakerAvatarProps {
  tone: SpeakerTone;
  size?: 'sm' | 'md';
}
