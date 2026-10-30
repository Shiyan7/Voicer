import { JSX } from 'solid-js';

import { borderBeamStyles } from './BorderBeam.styles';

interface BorderBeamProps {
  children: JSX.Element;
  radius: number;
  class?: string;
}

const styles = borderBeamStyles();

export function BorderBeam(props: BorderBeamProps) {
  return (
    <div
      class={styles.root({ class: props.class })}
      style={{ '--beam-radius': `${props.radius}px` }}
    >
      {props.children}
      <div class={styles.bloom()} />
    </div>
  );
}
