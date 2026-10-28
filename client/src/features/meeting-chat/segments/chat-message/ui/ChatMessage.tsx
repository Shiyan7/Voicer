import { For, Match, Show, Switch } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Timecode } from '@/shared/ui/timecode';

import { ChatInline } from '../../../types/ChatBlock';
import { ChatMessageProps } from '../types/ChatMessageProps';
import { chatMessageStyles } from './ChatMessage.styles';

const styles = chatMessageStyles();

export function ChatMessage(props: ChatMessageProps) {
  const renderInline = (inline: ChatInline) => (
    <Switch>
      <Match when={inline.kind === 'time' && inline}>
        {(time) => <Timecode ms={time().ms} onSeek={props.onSeek} />}
      </Match>
      <Match when={inline.kind === 'bold' && inline}>
        {(bold) => <strong class={styles.bold()}>{bold().text}</strong>}
      </Match>
      <Match when={inline.kind === 'code' && inline}>
        {(code) => <code class={styles.code()}>{code().text}</code>}
      </Match>
      <Match when={inline.kind === 'text' && inline}>
        {(text) => text().text}
      </Match>
    </Switch>
  );

  return (
    <Show
      when={!props.message.isUser}
      fallback={<p class={styles.user()}>{props.message.text}</p>}
    >
      <div class={styles.assistant()}>
        <For each={props.message.blocks}>
          {(block) => (
            <p class={styles.block({ bullet: block.isBullet })}>
              <For each={block.inlines}>{renderInline}</For>
            </p>
          )}
        </For>
        <Show when={props.message.isFailed}>
          <p class={styles.failed()}>{i18n.t('meetings.chat.failed')}</p>
        </Show>
      </div>
    </Show>
  );
}
