import { Index, Show } from 'solid-js';

import {
  ChatComposer,
  ChatMessage,
  ChatThinking,
  QuestionChips,
} from '@/entities/chat';
import { i18n } from '@/shared/i18n';
import type { MarkdownTime } from '@/shared/lib/markdown';
import { Icon } from '@/shared/ui/icon';
import { TimecodeLink } from '@/shared/ui/timecode';

import { useConversation } from '../model/useConversation';
import { ConversationDeps } from '../types/ConversationDeps';
import { conversationStyles } from './Conversation.styles';

const styles = conversationStyles();

const renderTime = (time: MarkdownTime) => (
  <Show when={time.meetingId}>
    {(meetingId) => <TimecodeLink meetingId={meetingId()} ms={time.ms} />}
  </Show>
);

export function Conversation(deps: ConversationDeps) {
  const vm = useConversation(deps);

  return (
    <section class={styles.root()}>
      <div class={styles.body()} ref={vm.setBody}>
        <div class={styles.feed()}>
          <Show when={vm.showIntro()}>
            <div class={styles.intro()}>
              <span class={styles.introIcon()}>
                <Icon size={20} name="common:sparkles" />
              </span>
              <h1 class={styles.introTitle()}>{i18n.t('chat.greeting')}</h1>
              <p class={styles.introHint()}>{i18n.t('chat.archive_hint')}</p>
              <QuestionChips
                class={styles.examples()}
                questions={vm.examples()}
                isLoading={false}
                disabled={vm.isAnswering()}
                onAsk={vm.ask}
              />
            </div>
          </Show>
          <Index each={vm.messages()}>
            {(message) => (
              <ChatMessage
                message={message()}
                isCopied={vm.isCopied(message().id)}
                renderTime={renderTime}
                onCopy={vm.copyMessage}
              />
            )}
          </Index>
          <Show when={vm.isThinking()}>
            <ChatThinking label={i18n.t('chat.searching')} />
          </Show>
          <QuestionChips
            questions={vm.followUps()}
            isLoading={false}
            disabled={vm.isAnswering()}
            onAsk={vm.ask}
          />
        </div>
      </div>
      <footer class={styles.footer()}>
        <ChatComposer
          draft={vm.draft()}
          canSend={vm.canSend()}
          placeholder={i18n.t('chat.archive_placeholder')}
          inputRef={vm.setInput}
          onDraft={vm.setDraft}
          onInputKeyDown={vm.onInputKeyDown}
          onSubmit={vm.submit}
        />
      </footer>
    </section>
  );
}
