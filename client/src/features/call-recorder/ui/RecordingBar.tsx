import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { glassIconButtonStyles } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { VoiceBlob } from '@/shared/ui/voice-blob';

import { RecordingBarProps } from '../types/RecordingBarProps';
import { recordingBarStyles } from './RecordingBar.styles';

const styles = recordingBarStyles();

export function RecordingBar(props: RecordingBarProps) {
  return (
    <div class={styles.root()}>
      <div class={styles.indicator()}>
        <VoiceBlob
          class={styles.blob()}
          level={props.level}
          paused={props.isPaused}
          size={112}
        />
        <span class={styles.mic({ paused: props.isPaused })}>
          <Icon size={24} name="common:microphone" />
        </span>
      </div>
      <span
        class={styles.time({ paused: props.isPaused })}
        role="status"
        aria-label={`${i18n.t('recorder.recording')} ${props.formattedSeconds}`}
      >
        {props.formattedSeconds}
      </span>
      <div class={styles.actions()}>
        <button
          class={glassIconButtonStyles({ size: 'md' })}
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
          class={glassIconButtonStyles({ size: 'md' })}
          type="button"
          aria-label={i18n.t('recorder.stop')}
          title={i18n.t('recorder.stop')}
          onClick={() => props.onStop()}
        >
          <Icon size={16} name="common:stop" />
        </button>
      </div>
    </div>
  );
}
