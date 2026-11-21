import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';
import { VoiceWave } from '@/shared/ui/voice-wave';

import { RecordingBarProps } from '../types/RecordingBarProps';
import { recordingBarStyles } from './RecordingBar.styles';

const styles = recordingBarStyles();

export function RecordingBar(props: RecordingBarProps) {
  return (
    <div
      class={styles.root({ visible: props.isVisible })}
      inert={!props.isVisible}
      role="status"
      aria-label={i18n.t('recorder.recording')}
    >
      <div class={styles.bar()}>
        <VoiceWave
          class={styles.wave()}
          level={props.level}
          paused={props.isPaused || !props.isVisible}
        />
        <button
          class={styles.action()}
          type="button"
          aria-label={props.pauseLabel}
          title={props.pauseLabel}
          onClick={props.onTogglePause}
        >
          <Show
            when={props.isPaused}
            fallback={<Icon size={16} name="common:pause" />}
          >
            <Icon size={16} name="common:play" />
          </Show>
        </button>
        <span class={styles.time({ paused: props.isPaused })}>
          {props.formattedSeconds}
        </span>
        <button
          class={styles.action({ class: 'justify-self-end' })}
          type="button"
          aria-label={i18n.t('recorder.stop')}
          title={i18n.t('recorder.stop')}
          onClick={props.onStop}
        >
          <Icon size={16} name="common:stop" />
        </button>
      </div>
    </div>
  );
}
