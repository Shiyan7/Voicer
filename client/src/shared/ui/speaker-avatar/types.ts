export type SpeakerTone =
  | 'steel'
  | 'sage'
  | 'sand'
  | 'clay'
  | 'mauve'
  | 'slate';

export interface SpeakerAvatarProps {
  tone: SpeakerTone;
  size?: 'sm' | 'md';
}
