import { i18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { LiveSessionBarProps } from '../types/LiveSessionBarProps';
import { liveSessionBarStyles } from './LiveSessionBar.styles';

const styles = liveSessionBarStyles();

export function LiveSessionBar(props: LiveSessionBarProps) {
  return (
    <div class={styles.root()}>
      <span class={styles.timer()}>{props.timerLabel}</span>
      <span class={styles.status()} role="status">
        <span class={styles.dot({ answering: props.isAnswering })} />
        {props.statusLabel}
      </span>
      <span class={styles.spacer()} />
      <Button variant="secondary" onClick={props.onCaptureCode}>
        <Icon name="common:document-text" size={16} />
        {i18n.t('live.session.capture_code')}
      </Button>
      <Button variant="secondary" onClick={props.onAnswerNow}>
        <Icon name="common:sparkles" size={16} />
        {i18n.t('live.session.answer_now')}
      </Button>
      <Button variant="danger" onClick={props.onStop}>
        <Icon name="common:stop" size={16} />
        {i18n.t('live.session.stop')}
      </Button>
    </div>
  );
}
