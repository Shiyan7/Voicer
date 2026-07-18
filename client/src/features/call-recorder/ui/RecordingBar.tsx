import { i18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';

import { recordingBarStyles } from './RecordingBar.styles';

const styles = recordingBarStyles();

type RecordingBarProps = {
  timeLabel: string;
  stopLabel: string | undefined;
  onStop: () => void;
};

export function RecordingBar(props: RecordingBarProps) {
  return (
    <div class={styles.root()}>
      <span class={styles.dot()} />
      <span class={styles.text()}>{i18n.t('recorder.recording')}</span>
      <span class={styles.time()}>{props.timeLabel}</span>
      <Button class={styles.stop()} onClick={() => props.onStop()}>
        {props.stopLabel}
      </Button>
    </div>
  );
}
