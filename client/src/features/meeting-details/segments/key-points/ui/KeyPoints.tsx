import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { revealWhen } from '@/shared/lib/dom';
import { Timecode } from '@/shared/ui/timecode';

import { useKeyPoints } from '../model/useKeyPoints';
import { KeyPointsDeps } from '../types/KeyPointsDeps';
import { keyPointsStyles } from './KeyPoints.styles';

const styles = keyPointsStyles();

export function KeyPoints(deps: KeyPointsDeps) {
  const vm = useKeyPoints(deps);

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
                  <Show when={point.atMs !== null}>
                    <Timecode ms={point.atMs ?? 0} onSeek={deps.onSeek} />
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
