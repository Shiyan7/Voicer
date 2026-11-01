import { Show } from 'solid-js';

import { Button } from '@/shared/ui/button';
import { CodeBlock } from '@/shared/ui/code-block';
import { Markdown } from '@/shared/ui/markdown';

import { LiveTurnCardProps } from '../types/LiveTurnCardProps';
import { liveTurnCardStyles } from './LiveTurnCard.styles';

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
        {(short) => (
          <div class={styles.answer()}>
            <Markdown class={styles.short()} blocks={short()} />
            <Show when={props.turn.code}>
              <CodeBlock
                code={props.turn.code}
                language={props.turn.codeLanguage}
              />
            </Show>
            <Show when={props.turn.details}>
              {(details) => (
                <>
                  <Button
                    class={styles.toggle()}
                    variant="ghost"
                    onClick={() => props.onToggleDetails(props.turn.id)}
                  >
                    {props.turn.toggleLabel}
                  </Button>
                  <Show when={props.turn.isExpanded}>
                    <Markdown class={styles.details()} blocks={details()} />
                  </Show>
                </>
              )}
            </Show>
          </div>
        )}
      </Show>
    </article>
  );
}
