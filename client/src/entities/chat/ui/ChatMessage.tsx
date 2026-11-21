import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';
import { Markdown } from '@/shared/ui/markdown';

import { ChatMessageProps } from '../types/ChatMessageProps';
import { chatMessageStyles } from './ChatMessage.styles';

const styles = chatMessageStyles();

export function ChatMessage(props: ChatMessageProps) {
  return (
    <Show
      when={!props.message.isUser}
      fallback={
        <p class={styles.user({ live: props.message.isLive })}>
          {props.message.plainText}
        </p>
      }
    >
      <div class={styles.assistant({ live: props.message.isLive })}>
        <Markdown blocks={props.message.blocks} renderTime={props.renderTime} />
        <Show when={props.message.isFailed}>
          <p class={styles.failed()}>{i18n.t('chat.failed')}</p>
        </Show>
        <Show when={!props.message.isStreaming && !props.message.isFailed}>
          <div class={styles.actions()}>
            <button
              class={styles.action()}
              type="button"
              aria-label={i18n.t('common.copy')}
              title={i18n.t('common.copy')}
              onClick={() => props.onCopy(props.message)}
            >
              <Show
                when={props.isCopied}
                fallback={<Icon size={16} name="common:copy" />}
              >
                <Icon size={16} name="common:check" />
              </Show>
            </button>
          </div>
        </Show>
      </div>
    </Show>
  );
}
