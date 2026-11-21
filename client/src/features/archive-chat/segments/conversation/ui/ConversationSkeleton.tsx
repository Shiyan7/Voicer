import { For } from 'solid-js';

import { SKELETON_ANSWER_WIDTHS } from '../config/SKELETON_ANSWER_WIDTHS';
import { conversationSkeletonStyles } from './ConversationSkeleton.styles';

const styles = conversationSkeletonStyles();

export function ConversationSkeleton() {
  return (
    <div class={styles.root()} aria-hidden="true">
      <div class={styles.question()} />
      <div class={styles.answer()}>
        <For each={SKELETON_ANSWER_WIDTHS}>
          {(width) => <div class={styles.line({ class: width })} />}
        </For>
      </div>
    </div>
  );
}
