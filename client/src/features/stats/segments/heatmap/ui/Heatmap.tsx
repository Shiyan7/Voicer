import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Tabs } from '@/shared/ui/tabs';

import { HEAT_LEVELS } from '../config/heatmapConfig';
import { useHeatmap } from '../model/useHeatmap';
import { HeatmapProps } from '../types/HeatmapProps';
import { heatLevelStyles } from './HeatLevel.styles';
import { heatmapStyles } from './Heatmap.styles';

const styles = heatmapStyles();

export function Heatmap(props: HeatmapProps) {
  const vm = useHeatmap(props);

  return (
    <section class={styles.root()}>
      <header class={styles.header()}>
        <h2 class={styles.title()}>{vm.totalLabel()}</h2>
        <Tabs
          size="sm"
          tabs={vm.yearTabs()}
          activeTab={props.year}
          onSelect={props.onYearChange}
        />
      </header>
      <div class={styles.body()}>
        <div class={styles.weekdays()}>
          <div class={styles.weekdayRows()}>
            <For each={vm.weekdayLabels()}>
              {(label) => <span class={styles.weekday()}>{label}</span>}
            </For>
          </div>
        </div>
        <div class={styles.grid()} onMouseLeave={vm.hideTooltip}>
          <div class={styles.months()}>
            <For each={vm.monthLabels()}>
              {(month) => (
                <span
                  class={styles.month()}
                  style={{ left: vm.monthOffset(month.column) }}
                >
                  {month.label}
                </span>
              )}
            </For>
          </div>
          <div class={styles.weeks({ loading: props.isLoading })}>
            <For each={vm.weeks()}>
              {(week) => (
                <div class={styles.week()}>
                  <For each={week}>
                    {(cell) => (
                      <button
                        class={styles.cell({
                          class: heatLevelStyles({ level: cell.level }),
                          outside: cell.isOutside,
                          future: cell.isFuture,
                          dimmed: vm.isDimmed(cell),
                        })}
                        type="button"
                        aria-label={cell.date}
                        aria-disabled={cell.isOutside || cell.isFuture}
                        onMouseEnter={(event) =>
                          vm.showTooltip(cell, event.currentTarget)
                        }
                        onClick={() => vm.select(cell)}
                      />
                    )}
                  </For>
                </div>
              )}
            </For>
          </div>
          <Show when={vm.tooltip()}>
            {(tooltip) => (
              <div
                class={styles.tooltip()}
                style={{
                  left: `${tooltip().left}px`,
                  top: `${tooltip().top}px`,
                }}
              >
                {tooltip().text}
              </div>
            )}
          </Show>
        </div>
      </div>
      <footer class={styles.footer()}>
        {i18n.t('stats.less')}
        <For each={HEAT_LEVELS}>
          {(level) => (
            <span
              class={styles.legendCell({ class: heatLevelStyles({ level }) })}
            />
          )}
        </For>
        {i18n.t('stats.more')}
      </footer>
    </section>
  );
}
