import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { useRecording } from '../model/useRecording';
import { RecordingDeps } from '../types/RecordingDeps';
import { recordingStyles } from './Recording.styles';

const styles = recordingStyles();

export function Recording(props: RecordingDeps) {
  const vm = useRecording(props);

  return (
    <div class={styles.root()}>
      <section class={styles.card()}>
        <Show
          when={!vm.isEmpty()}
          fallback={
            <p class={styles.hint()}>{i18n.t('meetings.transcript_empty')}</p>
          }
        >
          <div class={styles.list()}>
            <For each={vm.segments()}>
              {(segment) => (
                <button
                  class={styles.segment({ active: segment.isActive })}
                  type="button"
                  onClick={() => props.onSeek(segment.startMs)}
                >
                  <span class={styles.segmentHead()}>
                    <span
                      class={styles.segmentSpeaker({
                        speaker: segment.speaker,
                      })}
                    >
                      {segment.speakerLabel}
                    </span>
                    <span class={styles.segmentTime()}>
                      {segment.timeLabel}
                    </span>
                  </span>
                  <span class={styles.segmentText()}>{segment.text}</span>
                </button>
              )}
            </For>
          </div>
        </Show>
      </section>
    </div>
  );
}
