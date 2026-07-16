import { For, Match, Show, Switch } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { MarkdownInline } from '@/shared/lib/markdown';

import { useSummary } from '../model/useSummary';
import { SummaryDeps } from '../types/SummaryDeps';
import { summaryStyles } from './Summary.styles';

const styles = summaryStyles();

export function Summary(props: SummaryDeps) {
  const vm = useSummary(props);

  return (
    <Show when={!vm.isEmpty()}>
      <section class={styles.card()}>
        <h2 class={styles.sectionTitle()}>{i18n.t('meetings.summary')}</h2>
        <div class={styles.summary()}>
          <For each={vm.blocks()}>
            {(block) => (
              <Switch>
                <Match when={block.type === 'heading' && block}>
                  {(heading) => (
                    <h3 class={styles.heading()}>
                      <SummaryInlines inlines={heading().inlines} />
                    </h3>
                  )}
                </Match>
                <Match when={block.type === 'list' && block}>
                  {(list) => (
                    <ul class={styles.list()}>
                      <For each={list().items}>
                        {(item) => (
                          <li>
                            <SummaryInlines inlines={item} />
                          </li>
                        )}
                      </For>
                    </ul>
                  )}
                </Match>
                <Match when={block.type === 'paragraph' && block}>
                  {(paragraph) => (
                    <p class={styles.paragraph()}>
                      <SummaryInlines inlines={paragraph().inlines} />
                    </p>
                  )}
                </Match>
              </Switch>
            )}
          </For>
        </div>
      </section>
    </Show>
  );
}

interface SummaryInlinesProps {
  inlines: MarkdownInline[];
}

function SummaryInlines(props: SummaryInlinesProps) {
  return (
    <For each={props.inlines}>
      {(inline) => (
        <Show when={inline.bold} fallback={inline.text}>
          <strong class={styles.strong()}>{inline.text}</strong>
        </Show>
      )}
    </For>
  );
}
