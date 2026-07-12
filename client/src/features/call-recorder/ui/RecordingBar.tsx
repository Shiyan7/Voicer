import { Show } from 'solid-js';

import { Button } from '@/shared/ui/button';

import { recordingBarStyles } from './RecordingBar.styles';

const styles = recordingBarStyles();

type RecordingBarProps = {
  text: string | undefined;
  timeLabel: string;
  isUploading: boolean;
  uploadPercent: number;
  stopLabel: string | undefined;
  onStop: () => void;
};

export function RecordingBar(props: RecordingBarProps) {
  return (
    <div class={styles.root()}>
      <span class={styles.dot({ uploading: props.isUploading })} />
      <span class={styles.text()}>{props.text}</span>
      <Show
        when={props.isUploading}
        fallback={<span class={styles.time()}>{props.timeLabel}</span>}
      >
        <span class={styles.percent()}>{props.uploadPercent}%</span>
      </Show>
      <Show when={!props.isUploading}>
        <Button class={styles.stop()} onClick={() => props.onStop()}>
          {props.stopLabel}
        </Button>
      </Show>
      <Show when={props.isUploading}>
        <div
          class={styles.progress()}
          style={{ width: `${props.uploadPercent}%` }}
        />
      </Show>
    </div>
  );
}
