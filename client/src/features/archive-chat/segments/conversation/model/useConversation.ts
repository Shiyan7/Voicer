import {
  useChatMessages,
  useChatScroll,
  useMessageCopy,
} from '@/entities/chat';
import { i18n } from '@/shared/i18n';

import { EXAMPLE_QUESTION_KEYS } from '../config/conversationConfig';
import { ConversationDeps } from '../types/ConversationDeps';

export const useConversation = (deps: ConversationDeps) => {
  const chat = useChatMessages(deps);
  const copy = useMessageCopy();

  const scroll = useChatScroll({
    draft: chat.draft,
    scrollTrigger: chat.messages,
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
    copyMessage: copy.copyMessage,
    isCopied: copy.isCopied,
    setBody: scroll.setBody,
    setInput: scroll.setInput,
    onInputKeyDown: scroll.onInputKeyDown,
  };
};
