import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';
import { VoiceBeam } from '@/shared/ui/voice-beam';

import { RecordingBarProps } from '../types/RecordingBarProps';
import { recordingBarStyles } from './RecordingBar.styles';

const styles = recordingBarStyles();

export function RecordingBar(props: RecordingBarProps) {
  return (
    <div class={styles.root()} role="status" aria-label={i18n.t('recorder.recording')}>
      <VoiceBeam
        class={styles.pill()}
        level={props.level}
        paused={props.isPaused}
        radius={28}
      >
        <Icon class={styles.mic()} size={22} name="common:microphone" />
        <span class={styles.time({ paused: props.isPaused })}>
          {props.formattedSeconds}
        </span>
        <div class={styles.actions()}>
          <button
            class={styles.control()}
            type="button"
            aria-label={props.pauseLabel}
            title={props.pauseLabel}
            onClick={() => props.onTogglePause()}
          >
            <Show
              when={props.isPaused}
              fallback={<Icon size={16} name="common:pause" />}
            >
              <Icon size={16} name="common:play" />
            </Show>
          </button>
          <button
            class={styles.control()}
            type="button"
            aria-label={i18n.t('recorder.stop')}
            title={i18n.t('recorder.stop')}
            onClick={() => props.onStop()}
          >
            <Icon size={16} name="common:stop" />
          </button>
        </div>
      </VoiceBeam>
    </div>
  );
}
