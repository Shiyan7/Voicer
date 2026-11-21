import { useChatSession } from '@/entities/chat';

import { ConversationDeps } from '../types/ConversationDeps';

export const useConversation = (deps: ConversationDeps) => {
  const chat = useChatSession({
    threadId: deps.threadId,
    createThread: deps.createThread,
    onAsked: deps.onAsked,
    followAnswer: true,
  });

  const isEmpty = () =>
    !chat.hasMessages() && !chat.isLoading() && !chat.isAnswering();

  return {
    messages: chat.messages,
    followUps: chat.followUps,
    isThinking: chat.isThinking,
    isAnswering: chat.isAnswering,
    draft: chat.draft,
    setDraft: chat.setDraft,
    ask: chat.ask,
    isEmpty,
    canSend: chat.canSend,
    submit: chat.submit,
    copyMessage: chat.copyMessage,
    isCopied: chat.isCopied,
    setBody: chat.setBody,
    setInput: chat.setInput,
    onInputKeyDown: chat.onInputKeyDown,
  };
};
