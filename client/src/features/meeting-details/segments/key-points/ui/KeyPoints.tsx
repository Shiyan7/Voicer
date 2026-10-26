import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { revealWhen } from '@/shared/lib/dom';

import { useKeyPoints } from '../model/useKeyPoints';
import { KeyPointsParams } from '../types/KeyPointsParams';
import { keyPointsStyles } from './KeyPoints.styles';

const styles = keyPointsStyles();

export function KeyPoints(props: KeyPointsParams) {
  const vm = useKeyPoints(props);

  return (
    <Show when={!vm.isEmpty()}>
      <section class={styles.section()}>
        <h2 class={styles.sectionTitle()}>{i18n.t('meetings.key_points')}</h2>
        <div class={styles.list()}>
          <For each={vm.points()}>
            {(point) => (
              <div
                class={styles.item({ focused: point.isFocused })}
                ref={revealWhen(point.isFocused)}
              >
                <span class={styles.bullet()} />
                <p class={styles.text()}>
                  {point.text}
                  <Show when={point.timeLabel}>
                    <span class={styles.time()}>{point.timeLabel}</span>
                  </Show>
                </p>
              </div>
            )}
          </For>
        </div>
      </section>
    </Show>
  );
}
