import { SpeakerAvatarProps } from '../types/SpeakerAvatarProps';
import { speakerAvatarStyles } from './SpeakerAvatar.styles';

export function SpeakerAvatar(props: SpeakerAvatarProps) {
  return (
    <span class={speakerAvatarStyles({ tone: props.tone })}>
      {props.initial}
    </span>
  );
}
