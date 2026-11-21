import { Show } from 'solid-js';

import { ChatComposer, ChatFeed } from '@/entities/chat';
import { i18n } from '@/shared/i18n';
import type { MarkdownTime } from '@/shared/lib/markdown';
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
        <Show
          when={!vm.isEmpty()}
          fallback={<h1 class={styles.title()}>{i18n.t('chat.greeting')}</h1>}
        >
          <div class={styles.feed()}>
            <ChatFeed
              messages={vm.messages()}
              followUps={vm.followUps()}
              isThinking={vm.isThinking()}
              isAnswering={vm.isAnswering()}
              thinkingLabel={i18n.t('chat.searching')}
              isCopied={vm.isCopied}
              renderTime={renderTime}
              onCopy={vm.copyMessage}
              onAsk={vm.ask}
            />
          </div>
        </Show>
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
      <div class={styles.spacer({ empty: vm.isEmpty() })} />
    </section>
  );
}
