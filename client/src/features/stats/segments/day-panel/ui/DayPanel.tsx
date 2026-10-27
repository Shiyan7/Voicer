import { A } from '@solidjs/router';
import { For, Match, Show, Switch } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { useDayPanel } from '../model/useDayPanel';
import { DayPanelProps } from '../types/DayPanelProps';
import { dayPanelStyles } from './DayPanel.styles';

const styles = dayPanelStyles();

export function DayPanel(props: DayPanelProps) {
  const vm = useDayPanel(props);

  return (
    <section class={styles.root()}>
      <Show
        when={props.date}
        fallback={<p class={styles.hint()}>{i18n.t('stats.pick_day')}</p>}
      >
        <header class={styles.header()}>
          <h2 class={styles.title()}>{vm.title()}</h2>
          <Show when={!vm.isLoading() && !vm.isEmpty()}>
            <span class={styles.summary()}>{vm.summary()}</span>
          </Show>
        </header>
        <Switch>
          <Match when={vm.isLoading()}>
            <div class={styles.skeleton()} />
          </Match>
          <Match when={vm.isEmpty()}>
            <p class={styles.hint()}>{i18n.t('stats.day_empty')}</p>
          </Match>
          <Match when={true}>
            <div class={styles.list()}>
              <For each={vm.items()}>
                {(item) => (
                  <A class={styles.item()} href={item.href}>
                    <span class={styles.time()}>{item.time}</span>
                    <span class={styles.body()}>
                      <span class={styles.itemTitle()}>{item.title}</span>
                      <Show when={item.source}>
                        <span class={styles.source()}>{item.source}</span>
                      </Show>
                    </span>
                    <Show when={item.duration}>
                      <span class={styles.duration()}>{item.duration}</span>
                    </Show>
                  </A>
                )}
              </For>
            </div>
          </Match>
        </Switch>
      </Show>
    </section>
  );
}
