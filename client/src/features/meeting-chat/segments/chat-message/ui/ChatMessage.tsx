import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Markdown } from '@/shared/ui/markdown';
import { Timecode } from '@/shared/ui/timecode';

import { ChatMessageProps } from '../types/ChatMessageProps';
import { chatMessageStyles } from './ChatMessage.styles';

const styles = chatMessageStyles();

export function ChatMessage(props: ChatMessageProps) {
  return (
    <Show
      when={!props.message.isUser}
      fallback={<p class={styles.user()}>{props.message.text}</p>}
    >
      <div class={styles.assistant()}>
        <Markdown
          blocks={props.message.blocks}
          renderTime={(ms) => <Timecode ms={ms} onSeek={props.onSeek} />}
        />
        <Show when={props.message.isFailed}>
          <p class={styles.failed()}>{i18n.t('meetings.chat.failed')}</p>
        </Show>
      </div>
    </Show>
  );
}
