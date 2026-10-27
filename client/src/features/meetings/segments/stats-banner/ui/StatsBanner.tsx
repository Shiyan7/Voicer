import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { SKELETON_TILES } from '../config/SKELETON_TILES';
import { StatsBannerProps } from '../types/StatsBannerProps';
import { statsBannerStyles } from './StatsBanner.styles';

const styles = statsBannerStyles();

export function StatsBanner(props: StatsBannerProps) {
  return (
    <section class={styles.root()}>
      <div class={styles.glow()} />
      <h2 class={styles.greeting()}>{props.greeting} 👋</h2>
      <p class={styles.subtitle()}>{i18n.t('meetings.banner.subtitle')}</p>
      <div class={styles.tiles()}>
        <Show
          when={props.tiles.length}
          fallback={
            <For each={SKELETON_TILES}>
              {() => <div class={styles.tileSkeleton()} />}
            </For>
          }
        >
          <For each={props.tiles}>
            {(tile) => (
              <div class={styles.tile()}>
                <span class={styles.tileValue()}>{tile.value}</span>
                <span class={styles.tileLabel()}>{tile.label}</span>
              </div>
            )}
          </For>
        </Show>
      </div>
    </section>
  );
}
