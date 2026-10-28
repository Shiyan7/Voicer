import { For, Show } from 'solid-js';

import { SKELETON_CHIP_WIDTHS } from '../config/SKELETON_CHIP_WIDTHS';
import { QuestionChipsProps } from '../types/QuestionChipsProps';
import { questionChipsStyles } from './QuestionChips.styles';

const styles = questionChipsStyles();

export function QuestionChips(props: QuestionChipsProps) {
  return (
    <div class={styles.root()}>
      <Show
        when={!props.isLoading}
        fallback={
          <For each={SKELETON_CHIP_WIDTHS}>
            {(width) => <div class={styles.skeleton({ class: width })} />}
          </For>
        }
      >
        <For each={props.questions}>
          {(question) => (
            <button
              class={styles.chip()}
              type="button"
              disabled={props.disabled}
              onClick={() => props.onAsk(question)}
            >
              {question}
            </button>
          )}
        </For>
      </Show>
    </div>
  );
}
