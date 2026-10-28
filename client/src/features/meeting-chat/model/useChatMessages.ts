import { ChatMessageOutput, ChatRole } from '@schema';
import { createEffect, createSignal, on } from 'solid-js';

import { useToasts } from '@/entities/toasts';
import { i18n } from '@/shared/i18n';

import { meetingChatAskMutation } from '../api/meetingChatAskMutation';
import { meetingChatClearMutation } from '../api/meetingChatClearMutation';
import { meetingChatMessageSubscription } from '../api/meetingChatMessageSubscription';
import { meetingChatQuery } from '../api/meetingChatQuery';
import { toChatMessageView } from '../lib/toChatMessageView';
import { ChatMessagesParams } from '../types/ChatMessagesParams';

const byCreatedAt = (a: ChatMessageOutput, b: ChatMessageOutput) =>
  a.createdAt.localeCompare(b.createdAt);

export const useChatMessages = (params: ChatMessagesParams) => {
  const [messages, setMessages] = createSignal<ChatMessageOutput[]>([]);
  const [isAwaiting, setIsAwaiting] = createSignal(false);
  const [draft, setDraft] = createSignal('');
  const toasts = useToasts();

  const [chatResult] = meetingChatQuery(
    () => ({ meetingId: params.meetingId() }),
    { pause: () => !params.isActive() },
  );
  const [, askMutation] = meetingChatAskMutation();
  const [, clearMutation] = meetingChatClearMutation();

  const upsert = (message: ChatMessageOutput) => {
    setMessages((current) =>
      [...current.filter(({ id }) => id !== message.id), message].sort(
        byCreatedAt,
      ),
    );
    if (message.role === ChatRole.Assistant && !message.isStreaming) {
      setIsAwaiting(false);
    }
  };

  meetingChatMessageSubscription(
    () => ({ meetingId: params.meetingId() }),
    upsert,
    { pause: () => !params.isActive() },
  );

  createEffect(
    on(
      () => chatResult.data?.meetingChat.messages,
      (loaded) => loaded && setMessages([...loaded].sort(byCreatedAt)),
    ),
  );

  createEffect(
    on(
      () => params.meetingId(),
      () => {
        setMessages([]);
        setIsAwaiting(false);
      },
      { defer: true },
    ),
  );

  const isAnswering = () =>
    isAwaiting() || messages().some((message) => message.isStreaming);

  const ask = async (question: string) => {
    const text = question.trim();
    if (!text || isAnswering()) return;

    setDraft('');
    setIsAwaiting(true);
    const response = await askMutation({
      meetingId: params.meetingId(),
      question: text,
    });
    if (response.data) {
      upsert(response.data.meetingChatAsk);
      return;
    }
    setIsAwaiting(false);
    setDraft(text);
    toasts.show('error', i18n.t('meetings.chat.error'));
  };

  const clear = async () => {
    if (isAnswering()) return;
    await clearMutation({ meetingId: params.meetingId() });
    setMessages([]);
  };

  const lastMessage = () => messages().at(-1);

  const followUps = () => {
    const last = lastMessage();
    if (!last || last.role !== ChatRole.Assistant || last.isStreaming)
      return [];
    return last.followUps;
  };

  const isThinking = () => {
    const last = lastMessage();
    return (
      isAwaiting() && (!last || last.role === ChatRole.User || !last.content)
    );
  };

  const visibleMessages = () =>
    messages().filter((message) => message.content || message.isFailed);

  return {
    draft,
    setDraft,
    ask,
    clear,
    messages: () => visibleMessages().map(toChatMessageView),
    lastContent: () => lastMessage()?.content,
    hasMessages: () => messages().length > 0,
    suggestedQuestions: () =>
      chatResult.data?.meetingChat.suggestedQuestions ?? [],
    isLoading: () => chatResult.fetching && !chatResult.data,
    followUps,
    isThinking,
    isAnswering,
  };
};
