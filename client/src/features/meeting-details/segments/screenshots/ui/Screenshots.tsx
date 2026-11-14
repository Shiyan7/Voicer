import { For, Show } from 'solid-js';

import { Timecode } from '@/shared/ui/timecode';

import { useScreenshots } from '../model/useScreenshots';
import { ScreenshotsDeps } from '../types/ScreenshotsDeps';
import { screenshotsStyles } from './Screenshots.styles';
import { ScreenshotsEmpty } from './ScreenshotsEmpty';

const styles = screenshotsStyles();

export function Screenshots(deps: ScreenshotsDeps) {
  const vm = useScreenshots(deps);

  return (
    <Show
      when={!vm.isEmpty()}
      fallback={<ScreenshotsEmpty hint={vm.emptyHint()} />}
    >
      <div class={styles.grid()}>
        <For each={vm.items()}>
          {(item, index) => (
            <div class={styles.item()}>
              <button
                class={styles.thumb()}
                type="button"
                onClick={() => vm.open(index())}
              >
                <img
                  class={styles.image()}
                  src={item.thumbUrl}
                  alt={item.alt}
                  loading="lazy"
                />
              </button>
              <Timecode ms={item.offsetMs} onSeek={deps.onSeek} />
            </div>
          )}
        </For>
      </div>
    </Show>
  );
}
