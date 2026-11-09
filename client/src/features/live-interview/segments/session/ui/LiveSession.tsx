import { For, Show } from 'solid-js';

import { useScrollToBottom } from '@/shared/hooks/useScrollToBottom';
import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';

import { useLiveSession } from '../model/useLiveSession';
import { LiveSessionDeps } from '../types/LiveSessionDeps';
import { liveSessionStyles } from './LiveSession.styles';
import { LiveTurnCard } from './LiveTurnCard';

const styles = liveSessionStyles();

export function LiveSession(deps: LiveSessionDeps) {
  const vm = useLiveSession(deps);
  const scroll = useScrollToBottom();

  return (
    <div class={styles.root()}>
      <div class={styles.column()}>
        {deps.header}
        <Show
          when={!vm.isEmpty()}
          fallback={<p class={styles.empty()}>{deps.emptyLabel}</p>}
        >
          <div class={styles.list()}>
            <For each={vm.turnViews()}>
              {(turn) => (
                <LiveTurnCard
                  turn={turn()}
                  onToggleDetails={vm.toggleDetails}
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
      {deps.player}
    </div>
  );
}
