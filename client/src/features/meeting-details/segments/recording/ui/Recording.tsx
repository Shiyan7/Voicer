import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { AudioPlayer } from '@/shared/ui/audio-player';

import { useRecording } from '../model/useRecording';
import { RecordingParams } from '../types/RecordingParams';
import { recordingStyles } from './Recording.styles';

const styles = recordingStyles();

export function Recording(props: RecordingParams) {
  const vm = useRecording(props);

  return (
    <div class={styles.root()}>
      <Show when={props.audioUrl}>
        {(audioUrl) => (
          <AudioPlayer
            ref={vm.setPlayerApi}
            src={audioUrl()}
            onTimeUpdate={vm.onTimeUpdate}
          />
        )}
      </Show>

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
                  onClick={() => vm.seekTo(segment.startMs)}
                >
                  <span class={styles.segmentHead()}>
                    <span
                      class={styles.segmentSpeaker({ speaker: segment.speaker })}
                    >
                      {segment.speakerLabel}
                    </span>
                    <span class={styles.segmentTime()}>{segment.timeLabel}</span>
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
