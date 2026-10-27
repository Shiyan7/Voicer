import { For } from 'solid-js';

import { SKELETON_PLACEHOLDERS } from '../config/SKELETON_PLACEHOLDERS';
import { meetingsSkeletonStyles } from './MeetingsSkeleton.styles';

const styles = meetingsSkeletonStyles();

export function MeetingsSkeleton() {
  return (
    <div class={styles.list()}>
      <For each={SKELETON_PLACEHOLDERS}>
        {() => (
          <div class={styles.row()}>
            <div class={styles.icon()} />
            <div class={styles.line()} />
          </div>
        )}
      </For>
    </div>
  );
}
