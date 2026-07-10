import { ParentProps } from 'solid-js';

import { pageFadeStyles } from './PageFade.styles';

const styles = pageFadeStyles();

export function PageFade(props: ParentProps) {
  return <div class={styles.root()}>{props.children}</div>;
}
