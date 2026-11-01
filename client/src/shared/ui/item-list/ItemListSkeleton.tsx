import { For } from 'solid-js';

import { SKELETON_ROWS } from './config/SKELETON_ROWS';
import { itemListSkeletonStyles } from './ItemListSkeleton.styles';

const styles = itemListSkeletonStyles();

export function ItemListSkeleton() {
  return (
    <div class={styles.list()}>
      <For each={SKELETON_ROWS}>
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
