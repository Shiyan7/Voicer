import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { GlassIconButton } from '@/shared/ui/glass-icon-button';
import { Icon } from '@/shared/ui/icon';
import { VoiceBlob } from '@/shared/ui/voice-blob';

import { RecordingBarProps } from '../types/RecordingBarProps';
import { recordingBarStyles } from './RecordingBar.styles';

const styles = recordingBarStyles();

export function RecordingBar(props: RecordingBarProps) {
  return (
    <div class={styles.root()}>
      <div
        class={styles.indicator()}
        role="img"
        aria-label={i18n.t('recorder.recording')}
      >
        <VoiceBlob
          class={styles.blob()}
          level={props.level}
          paused={props.isPaused}
          size={112}
        />
        <span class={styles.mic()}>
          <Icon size={24} name="common:microphone" />
        </span>
      </div>
      <span class={styles.time({ paused: props.isPaused })}>
        {props.formattedSeconds}
      </span>
      <div class={styles.actions()}>
        <GlassIconButton
          size="md"
          label={props.pauseLabel}
          onClick={props.onTogglePause}
        >
          <Show
            when={props.isPaused}
            fallback={<Icon size={16} name="common:pause" />}
          >
            <Icon size={16} name="common:play" />
          </Show>
        </GlassIconButton>
        <GlassIconButton
          size="md"
          label={i18n.t('recorder.stop')}
          onClick={props.onStop}
        >
          <Icon size={16} name="common:stop" />
        </GlassIconButton>
      </div>
    </div>
  );
}
