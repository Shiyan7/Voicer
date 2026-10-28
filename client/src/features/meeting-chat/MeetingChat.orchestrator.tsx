import { For, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { i18n } from '@/shared/i18n';

import { meetingChatStyles } from './MeetingChat.styles';
import { useMeetingChat } from './model/useMeetingChat';
import { ChatFab } from './segments/chat-fab';
import { ChatMessage, ChatThinking } from './segments/chat-message';
import { ChatPanel } from './segments/chat-panel';
import { QuestionChips } from './segments/question-chips';
import { MeetingChatProps } from './types/MeetingChatProps';

const styles = meetingChatStyles;

export function MeetingChatOrchestrator(props: MeetingChatProps) {
  const vm = useMeetingChat(props);

  return (
    <>
      <div class={styles()} ref={vm.setBoundary} aria-hidden />
      <Portal>
        <Show when={vm.panelPlacement()}>
          {(placement) => (
            <ChatPanel
              placement={placement()}
              showHint={vm.showSuggestions()}
              canClear={vm.hasMessages() && !vm.isAnswering()}
              canSend={vm.canSend()}
              draft={vm.draft()}
              bodyRef={vm.setBody}
              inputRef={vm.setInput}
              onDraft={vm.setDraft}
              onInputKeyDown={vm.onInputKeyDown}
              onSubmit={vm.submit}
              onClear={vm.clear}
              onClose={vm.close}
            >
              <Show when={vm.showSuggestions()}>
                <QuestionChips
                  questions={vm.suggestedQuestions()}
                  isLoading={vm.isSuggestionsLoading()}
                  disabled={vm.isAnswering()}
                  onAsk={vm.ask}
                />
              </Show>
              <For each={vm.messages()}>
                {(message) => (
                  <ChatMessage message={message} onSeek={vm.seek} />
                )}
              </For>
              <Show when={vm.isThinking()}>
                <ChatThinking label={i18n.t('meetings.chat.thinking')} />
              </Show>
              <QuestionChips
                questions={vm.followUps()}
                isLoading={false}
                disabled={vm.isAnswering()}
                onAsk={vm.ask}
              />
            </ChatPanel>
          )}
        </Show>
        <Show when={vm.fabPoint()}>
          {(point) => (
            <ChatFab
              point={point()}
              isOpen={vm.isOpen()}
              isDragging={vm.isFabDragging()}
              showBadge={vm.showAnsweringBadge()}
              {...vm.fabHandlers}
            />
          )}
        </Show>
      </Portal>
    </>
  );
}
