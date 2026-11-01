import { A } from '@solidjs/router';
import { For, Show } from 'solid-js';

import { useStickToBottom } from '@/shared/hooks/useStickToBottom';
import { i18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { LiveSessionProps } from '../types/LiveSessionProps';
import { liveSessionStyles } from './LiveSession.styles';
import { LiveTurnCard } from './LiveTurnCard';

const styles = liveSessionStyles();

export function LiveSession(props: LiveSessionProps) {
  const { setContent } = useStickToBottom();

  return (
    <div class={styles.root()}>
      <Show
        when={!props.isReadOnly}
        fallback={
          <div class={styles.bar()}>
            <Button variant="ghost" onClick={props.onBack}>
              {i18n.t('live.session.back')}
            </Button>
            <span class={styles.spacer()} />
            <Show when={props.recordingHref}>
              <A class={styles.recordingLink()} href={props.recordingHref}>
                {i18n.t('live.session.listen_recording')}
              </A>
            </Show>
          </div>
        }
      >
        <div class={styles.bar()}>
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
      </Show>
      <Show
        when={!props.isEmpty}
        fallback={
          <p class={styles.empty()}>{i18n.t('live.session.waiting')}</p>
        }
      >
        <div class={styles.list()} ref={setContent}>
          <For each={props.turns}>
            {(turn) => (
              <LiveTurnCard
                turn={turn}
                onToggleDetails={props.onToggleDetails}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
