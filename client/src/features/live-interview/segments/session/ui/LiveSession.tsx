import { For, Show } from 'solid-js';

import { useScrollToBottom } from '@/shared/hooks/useScrollToBottom';
import { i18n } from '@/shared/i18n';
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
        {props.header}
        <Show
          when={!props.isEmpty}
          fallback={<p class={styles.empty()}>{props.emptyLabel}</p>}
        >
          <div class={styles.list()}>
            <For each={props.turns}>
              {(turn) => (
                <LiveTurnCard
                  turn={turn()}
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
