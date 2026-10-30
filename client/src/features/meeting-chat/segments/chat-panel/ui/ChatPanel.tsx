import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { BorderBeam } from '@/shared/ui/border-beam';
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
              aria-label={i18n.t('meetings.chat.clear')}
              title={i18n.t('meetings.chat.clear')}
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

      <footer class={styles.footer()}>
        <form
          class={styles.form()}
          onSubmit={(event) => {
            event.preventDefault();
            props.onSubmit();
          }}
        >
          <BorderBeam class={styles.inputBeam()} radius={26}>
            <textarea
              class={styles.input()}
              ref={props.inputRef}
              rows={1}
              maxLength={2000}
              value={props.draft}
              placeholder={i18n.t('meetings.chat.placeholder')}
              onInput={(event) => props.onDraft(event.currentTarget.value)}
              onKeyDown={props.onInputKeyDown}
            />
            <button
              class={styles.send()}
              type="submit"
              disabled={!props.canSend}
              aria-label={i18n.t('meetings.chat.send')}
            >
              <Icon size={18} name="common:arrow-up" />
            </button>
          </BorderBeam>
        </form>
        <p class={styles.disclaimer()}>{i18n.t('meetings.chat.disclaimer')}</p>
      </footer>
    </section>
  );
}
