import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { revealWhen } from '@/shared/lib/dom';
import { SpeakerAvatar } from '@/shared/ui/speaker-avatar';

import { useRecording } from '../model/useRecording';
import { RecordingDeps } from '../types/RecordingDeps';
import { recordingStyles } from './Recording.styles';

const styles = recordingStyles();

export function Recording(deps: RecordingDeps) {
  const vm = useRecording(deps);

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
              {(group) => (
                <div class={styles.group()}>
                  <button
                    class={styles.head()}
                    type="button"
                    onClick={() => deps.onSeek(group.startMs)}
                  >
                    <SpeakerAvatar size="md" tone={group.tone} />
                    <span class={styles.speaker()}>{group.speakerLabel}</span>
                    <span class={styles.time({ tone: group.tone })}>
                      {group.timeLabel}
                    </span>
                  </button>
                  <div class={styles.body({ tone: group.tone })}>
                    <For each={group.paragraphs}>
                      {(paragraph) => (
                        <button
                          class={styles.paragraph({
                            active: vm.isParagraphActive(paragraph.id),
                            focused: paragraph.isFocused,
                          })}
                          ref={revealWhen(paragraph.isFocused)}
                          type="button"
                          onClick={() => deps.onSeek(paragraph.startMs)}
                        >
                          {paragraph.text}
                        </button>
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </section>
    </div>
  );
}
