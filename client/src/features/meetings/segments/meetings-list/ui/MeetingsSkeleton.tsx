import { For } from 'solid-js';

import { meetingsSkeletonStyles } from './MeetingsSkeleton.styles';

const styles = meetingsSkeletonStyles();

const PLACEHOLDERS = [0, 1, 2];

export function MeetingsSkeleton() {
  return (
    <div class={styles.list()}>
      <For each={PLACEHOLDERS}>{() => <div class={styles.row()} />}</For>
    </div>
  );
}
