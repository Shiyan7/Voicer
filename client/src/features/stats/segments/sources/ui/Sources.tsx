import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { useSources } from '../model/useSources';
import { SourcesProps } from '../types/SourcesProps';
import { sourcesStyles } from './Sources.styles';

const styles = sourcesStyles();

export function Sources(props: SourcesProps) {
  const vm = useSources(props);

  return (
    <section class={styles.root()}>
      <h2 class={styles.title()}>{i18n.t('stats.sources.title')}</h2>
      <Show
        when={!vm.isEmpty()}
        fallback={<p class={styles.empty()}>{i18n.t('stats.empty')}</p>}
      >
        <div class={styles.list()}>
          <For each={vm.rows()}>
            {(row) => (
              <div class={styles.row()}>
                <div class={styles.meta()}>
                  <span class={styles.label()}>{row.label}</span>
                  <span class={styles.numbers()}>
                    {row.calls} · {row.duration}
                  </span>
                </div>
                <div class={styles.track()}>
                  <div class={styles.bar()} style={{ width: row.share }} />
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </section>
  );
}
