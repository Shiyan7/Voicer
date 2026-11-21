import { ChatMessageOutput, ChatRole } from '@schema';
import { createEffect, createMemo, createSignal, mapArray, on } from 'solid-js';

import { useToasts } from '@/entities/toasts';
import { i18n } from '@/shared/i18n';

import { chatAskMutation } from '../api/chatAskMutation';
import { chatClearMutation } from '../api/chatClearMutation';
import { chatMessagesQuery } from '../api/chatMessagesQuery';
import { chatMessageSubscription } from '../api/chatMessageSubscription';
import { mergeMessages } from '../lib/mergeMessages';
import { snapshotMessages } from '../lib/snapshotMessages';
import { toChatMessageView } from '../lib/toChatMessageView';
import { ChatMessagesDeps } from '../types/ChatMessagesDeps';
import { useTypewriter } from './useTypewriter';

export const useChatMessages = (deps: ChatMessagesDeps) => {
  const [messages, setMessages] = createSignal<ChatMessageOutput[]>([]);
  const [isAwaiting, setIsAwaiting] = createSignal(false);
  const [draft, setDraft] = createSignal('');
  const toasts = useToasts();
  const typewriter = useTypewriter(messages);

  const threadVariables = () => ({ threadId: deps.threadId() ?? '' });

  const isPaused = () => !deps.threadId();

  const [messagesResult] = chatMessagesQuery(threadVariables, {
    pause: isPaused,
  });
  const [, askMutation] = chatAskMutation();
  const [, clearMutation] = chatClearMutation();

  const upsert = (message: ChatMessageOutput) => {
    setMessages((current) => mergeMessages(current, [message]));
    if (message.role !== ChatRole.Assistant) return;
    typewriter.type(message.id);
    if (!message.isStreaming) setIsAwaiting(false);
  };

  const keepThreadMessages = (threadId: string | undefined) =>
    setMessages((current) =>
      current.filter((message) => message.threadId === threadId),
    );

  chatMessageSubscription(threadVariables, upsert, { pause: isPaused });

  const loadedMessages = () => {
    const storeMessages = messagesResult.data?.chatMessages;
    return storeMessages && snapshotMessages(storeMessages);
  };

  createEffect(
    on(
      loadedMessages,
      (loaded) =>
        loaded && setMessages((current) => mergeMessages(current, loaded)),
    ),
  );

  createEffect(
    on(
      deps.threadId,
      (threadId, previous) => {
        keepThreadMessages(threadId);
        if (previous) setIsAwaiting(false);
      },
      { defer: true },
    ),
  );

  const threadMessages = createMemo(() =>
    messages().filter(({ threadId }) => threadId === deps.threadId()),
  );

  const shownMessages = createMemo(() =>
    threadMessages().map(typewriter.reveal),
  );

  const visibleMessages = createMemo(() =>
    shownMessages().filter((message) => message.content || message.isFailed),
  );

  const chatMessages = createMemo(mapArray(visibleMessages, toChatMessageView));

  const isAnswering = () =>
    isAwaiting() || shownMessages().some((message) => message.isStreaming);

  const canSend = () => Boolean(draft().trim()) && !isAnswering();

  const resolveThreadId = async () =>
    deps.threadId() ?? (await deps.createThread?.());

  const sendQuestion = async (question: string) => {
    const threadId = await resolveThreadId();
    if (!threadId) return null;
    const response = await askMutation({ threadId, question });
    return response.data?.chatAsk ?? null;
  };

  const ask = async (question: string) => {
    const text = question.trim();
    if (!text || isAnswering()) return;

    setDraft('');
    setIsAwaiting(true);
    const userMessage = await sendQuestion(text);
    if (userMessage) {
      upsert(userMessage);
      deps.onAsked?.();
      return;
    }
    setIsAwaiting(false);
    setDraft(text);
    toasts.show('error', i18n.t('chat.error'));
  };

  const submit = () => void ask(draft());

  const clear = async () => {
    const threadId = deps.threadId();
    if (!threadId || isAnswering()) return;
    const response = await clearMutation({ threadId });
    if (response.error) {
      toasts.show('error', i18n.t('chat.clear_error'));
      return;
    }
    setMessages([]);
  };

  const lastMessage = () => shownMessages().at(-1);

  const followUps = () => {
    const last = lastMessage();
    if (!last || last.role !== ChatRole.Assistant || last.isStreaming)
      return [];
    return last.followUps;
  };

  const isThinking = () => {
    const last = lastMessage();
    return (
      isAnswering() && (!last || last.role === ChatRole.User || !last.content)
    );
  };

  const questionCount = () =>
    threadMessages().filter((message) => message.role === ChatRole.User).length;

  const hasMessages = () => threadMessages().length > 0;

  const isLoading = () => messagesResult.fetching && !hasMessages();

  return {
    draft,
    setDraft,
    ask,
    submit,
    canSend,
    clear,
    messages: chatMessages,
    questionCount,
    hasMessages,
    isLoading,
    followUps,
    isThinking,
    isAnswering,
  };
};
