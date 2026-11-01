import { For, Show } from 'solid-js';

import { Button } from '@/shared/ui/button';

import { LiveTurnCardProps } from '../types/LiveTurnCardProps';
import { codeTokenStyles, liveTurnCardStyles } from './LiveTurnCard.styles';

const styles = liveTurnCardStyles();

export function LiveTurnCard(props: LiveTurnCardProps) {
  return (
    <article class={styles.root()}>
      <p class={styles.question({ live: props.turn.isQuestionLive })}>
        {props.turn.question}
        <Show when={props.turn.isQuestionLive}>
          <span class={styles.cursor()} />
        </Show>
      </p>
      <Show when={props.turn.short}>
        <div class={styles.answer()}>
          <p class={styles.short()}>{props.turn.short}</p>
          <Show when={props.turn.hasCode}>
            <pre class={styles.code()}>
              <span class={styles.language()}>{props.turn.codeLanguage}</span>
              <code>
                <For each={props.turn.codeTokens}>
                  {(token) => (
                    <span class={codeTokenStyles({ kind: token.kind })}>
                      {token.text}
                    </span>
                  )}
                </For>
              </code>
            </pre>
          </Show>
          <Show when={props.turn.hasDetails}>
            <Button
              class={styles.toggle()}
              variant="ghost"
              onClick={() => props.onToggleDetails(props.turn.id)}
            >
              {props.turn.toggleLabel}
            </Button>
            <Show when={props.turn.isExpanded}>
              <div class={styles.details()}>
                <For each={props.turn.detailLines}>
                  {(line) => <p>{line}</p>}
                </For>
              </div>
            </Show>
          </Show>
        </div>
      </Show>
    </article>
  );
}
