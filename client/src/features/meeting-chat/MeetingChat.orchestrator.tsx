import { Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { ChatComposer, ChatFeed, QuestionChips } from '@/entities/chat';
import { i18n } from '@/shared/i18n';
import { Timecode } from '@/shared/ui/timecode';

import { meetingChatStyles } from './MeetingChat.styles';
import { useMeetingChat } from './model/useMeetingChat';
import { ChatFab } from './segments/chat-fab';
import { ChatPanel } from './segments/chat-panel';
import { MeetingChatDeps } from './types/MeetingChatDeps';

const styles = meetingChatStyles();

export function MeetingChatOrchestrator(deps: MeetingChatDeps) {
  const vm = useMeetingChat(deps);

  return (
    <>
      <div class={styles.root()} ref={vm.setBoundary} aria-hidden />
      <Portal>
        <Show when={vm.panelPlacement()}>
          {(placement) => (
            <ChatPanel
              placement={placement()}
              showHint={vm.showSuggestions()}
              canClear={vm.hasMessages() && !vm.isAnswering()}
              bodyRef={vm.setBody}
              onClear={vm.clear}
              onClose={vm.close}
              composer={
                <ChatComposer
                  draft={vm.draft()}
                  canSend={vm.canSend()}
                  placeholder={i18n.t('chat.placeholder')}
                  inputRef={vm.setInput}
                  onDraft={vm.setDraft}
                  onInputKeyDown={vm.onInputKeyDown}
                  onSubmit={vm.submit}
                />
              }
            >
              <Show when={vm.showSuggestions()}>
                <QuestionChips
                  questions={vm.suggestedQuestions()}
                  isLoading={vm.isSuggestionsLoading()}
                  disabled={vm.isAnswering()}
                  onAsk={vm.ask}
                />
              </Show>
              <ChatFeed
                messages={vm.messages()}
                followUps={vm.followUps()}
                isThinking={vm.isThinking()}
                isAnswering={vm.isAnswering()}
                thinkingLabel={i18n.t('chat.thinking')}
                isCopied={vm.isCopied}
                renderTime={(time) => (
                  <Timecode ms={time.ms} onSeek={vm.seek} />
                )}
                onCopy={vm.copyMessage}
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
