import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';

import { ChatPanelProps } from '../types/ChatPanelProps';
import { chatPanelStyles } from './ChatPanel.styles';

const styles = chatPanelStyles();

export function ChatPanel(props: ChatPanelProps) {
  return (
    <section
      class={styles.root()}
      role="dialog"
      aria-label={i18n.t('meetings.chat.title')}
      style={{
        left: `${props.placement.left}px`,
        top: `${props.placement.top}px`,
        width: `${props.placement.width}px`,
        height: `${props.placement.height}px`,
        'transform-origin': props.placement.origin,
      }}
    >
      <header class={styles.header()}>
        <h2 class={styles.title()}>{i18n.t('meetings.chat.title')}</h2>
        <div class={styles.headerActions()}>
          <Show when={props.canClear}>
            <button
              class={styles.iconButton()}
              type="button"
              aria-label={i18n.t('chat.clear')}
              title={i18n.t('chat.clear')}
              onClick={props.onClear}
            >
              <Icon size={16} name="common:trash" />
            </button>
          </Show>
          <button
            class={styles.iconButton()}
            type="button"
            aria-label={i18n.t('meetings.chat.close')}
            onClick={props.onClose}
          >
            <Icon size={14} name="common:cross" />
          </button>
        </div>
      </header>

      <div class={styles.body()} ref={props.bodyRef}>
        <div class={styles.intro()}>
          <span class={styles.introIcon()}>
            <Icon size={18} name="common:sparkles" />
          </span>
          <p>{i18n.t('meetings.chat.greeting')}</p>
          <Show when={props.showHint}>
            <p class={styles.hint()}>{i18n.t('meetings.chat.hint')}</p>
          </Show>
        </div>
        {props.children}
      </div>

      <footer class={styles.footer()}>{props.composer}</footer>
    </section>
  );
}
