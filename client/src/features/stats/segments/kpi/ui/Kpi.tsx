import { For, Show } from 'solid-js';

import { SKELETON_TILES } from '../config/SKELETON_TILES';
import { useKpi } from '../model/useKpi';
import { KpiProps } from '../types/KpiProps';
import { kpiStyles } from './Kpi.styles';

const styles = kpiStyles();

export function Kpi(props: KpiProps) {
  const vm = useKpi(props);

  return (
    <div class={styles.root()}>
      <Show
        when={!vm.isLoading()}
        fallback={
          <For each={SKELETON_TILES}>
            {() => <div class={styles.skeleton()} />}
          </For>
        }
      >
        <For each={vm.tiles()}>
          {(tile) => (
            <div class={styles.tile()}>
              <span class={styles.value()}>{tile.value}</span>
              <span class={styles.label()}>{tile.label}</span>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
}
