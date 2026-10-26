import { Icon } from '@/shared/ui/icon';

import { speakerAvatarStyles } from './SpeakerAvatar.styles';
import { SpeakerAvatarProps } from './types';

const styles = speakerAvatarStyles();

export function SpeakerAvatar(props: SpeakerAvatarProps) {
  return (
    <span class={styles.root({ tone: props.tone, size: props.size })}>
      <Icon class={styles.face({ size: props.size })} name="common:smiley" />
    </span>
  );
}
