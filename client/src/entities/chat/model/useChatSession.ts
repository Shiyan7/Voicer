import { ChatSessionDeps } from '../types/ChatSessionDeps';
import { useChatMessages } from './useChatMessages';
import { useChatScroll } from './useChatScroll';
import { useMessageCopy } from './useMessageCopy';

export const useChatSession = (deps: ChatSessionDeps) => {
  const chat = useChatMessages(deps);
  const copy = useMessageCopy();

  const scroll = useChatScroll({
    shouldFocus: deps.shouldFocus,
    draft: chat.draft,
    scrollTrigger: deps.followAnswer ? chat.messages : chat.questionCount,
    onSubmit: chat.submit,
  });

  return {
    messages: chat.messages,
    hasMessages: chat.hasMessages,
    isLoading: chat.isLoading,
    followUps: chat.followUps,
    isThinking: chat.isThinking,
    isAnswering: chat.isAnswering,
    draft: chat.draft,
    setDraft: chat.setDraft,
    canSend: chat.canSend,
    ask: chat.ask,
    submit: chat.submit,
    clear: chat.clear,
    copyMessage: copy.copyMessage,
    isCopied: copy.isCopied,
    setBody: scroll.setBody,
    setInput: scroll.setInput,
    onInputKeyDown: scroll.onInputKeyDown,
  };
};
