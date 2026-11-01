import { For, Show } from 'solid-js';

import { useScrollToBottom } from '@/shared/hooks/useScrollToBottom';
import { i18n } from '@/shared/i18n';
import { BackButton } from '@/shared/ui/back-button';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { LiveSessionProps } from '../types/LiveSessionProps';
import { liveSessionStyles } from './LiveSession.styles';
import { LiveTurnCard } from './LiveTurnCard';

const styles = liveSessionStyles();

export function LiveSession(props: LiveSessionProps) {
  const scroll = useScrollToBottom();

  return (
    <div class={styles.root()}>
      <div class={styles.column()}>
        <Show
          when={!props.isReadOnly}
          fallback={
            <header class={styles.header()}>
              <BackButton onClick={props.onBack} />
              <h1 class={styles.title()}>{props.reviewTitle}</h1>
            </header>
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
          <div class={styles.list()}>
            <For each={props.turns}>
              {(turn) => (
                <LiveTurnCard
                  turn={turn}
                  onToggleDetails={props.onToggleDetails}
                />
              )}
            </For>
          </div>
          <Show when={scroll.isAwayFromBottom()}>
            <button
              class={styles.toBottom()}
              type="button"
              aria-label={i18n.t('live.session.scroll_down')}
              onClick={scroll.scrollToBottom}
            >
              <Icon
                class={styles.toBottomIcon()}
                name="common:arrow-up"
                size={18}
              />
            </button>
          </Show>
        </Show>
      </div>
      {props.player}
    </div>
  );
}
