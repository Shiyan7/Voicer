import { i18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';

import { RecordingBarProps } from '../types/RecordingBarProps';
import { recordingBarStyles } from './RecordingBar.styles';

const styles = recordingBarStyles();

export function RecordingBar(props: RecordingBarProps) {
  return (
    <div class={styles.root()}>
      <span class={styles.dot()} />
      <span class={styles.text()}>{i18n.t('recorder.recording')}</span>
      <span class={styles.time()}>{props.formattedSeconds}</span>
      <Button class={styles.stop()} onClick={() => props.onStop()}>
        {i18n.t('recorder.stop')}
      </Button>
    </div>
  );
}
