import { useChatMessages, useChatScroll } from '@/entities/chat';
import { i18n } from '@/shared/i18n';

import { EXAMPLE_QUESTION_KEYS } from '../config/conversationConfig';
import { ConversationDeps } from '../types/ConversationDeps';

export const useConversation = (deps: ConversationDeps) => {
  const chat = useChatMessages(deps);

  const shouldFocus = () => true;

  const scrollTrigger = () =>
    `${deps.threadId()}:${chat.questionCount()}:${chat.messages().length}`;

  const scroll = useChatScroll({
    shouldFocus,
    draft: chat.draft,
    scrollTrigger,
    onSubmit: chat.submit,
  });

  const showIntro = () => !chat.hasMessages() && !chat.isLoading();

  const examples = () => EXAMPLE_QUESTION_KEYS.map((key) => i18n.t(key));

  return {
    messages: chat.messages,
    followUps: chat.followUps,
    isThinking: chat.isThinking,
    isAnswering: chat.isAnswering,
    draft: chat.draft,
    setDraft: chat.setDraft,
    ask: chat.ask,
    showIntro,
    examples,
    canSend: chat.canSend,
    submit: chat.submit,
    copyMessage: chat.copyMessage,
    isCopied: chat.isCopied,
    setBody: scroll.setBody,
    setInput: scroll.setInput,
    onInputKeyDown: scroll.onInputKeyDown,
  };
};
