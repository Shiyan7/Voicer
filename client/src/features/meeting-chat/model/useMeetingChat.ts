import { createSignal } from 'solid-js';

import { useChatSession } from '@/entities/chat';
import { useKeydown } from '@/shared/lib/dom';

import { meetingChatSuggestionsQuery } from '../api/meetingChatSuggestionsQuery';
import { meetingChatThreadQuery } from '../api/meetingChatThreadQuery';
import { getPanelPlacement } from '../lib/getPanelPlacement';
import { MeetingChatDeps } from '../types/MeetingChatDeps';
import { useDraggableFab } from './useDraggableFab';

export const useMeetingChat = (deps: MeetingChatDeps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [hasOpened, setHasOpened] = createSignal(false);
  const [boundary, setBoundary] = createSignal<HTMLElement>();

  const open = () => {
    setHasOpened(true);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const toggle = () => (isOpen() ? close() : open());

  const meetingVariables = () => ({ meetingId: deps.meetingId });

  const [threadResult] = meetingChatThreadQuery(meetingVariables, {
    pause: () => !hasOpened(),
  });
  const [suggestionsResult] = meetingChatSuggestionsQuery(meetingVariables, {
    pause: () => !hasOpened(),
  });

  const threadId = () => threadResult.data?.meetingChatThread.id;

  const chat = useChatSession({ threadId, shouldFocus: isOpen });

  const fab = useDraggableFab({
    boundary,
    obstacle: () => deps.obstacle,
    onTap: toggle,
  });

  useKeydown((event) => {
    if (event.key === 'Escape' && isOpen()) close();
  });

  const panelPlacement = () => {
    const point = fab.point();
    const bounds = fab.bounds();
    if (!isOpen() || fab.isDragging() || !point || !bounds) return null;
    return getPanelPlacement(point, bounds);
  };

  const showSuggestions = () => !chat.hasMessages();

  const showAnsweringBadge = () => chat.isAnswering() && !isOpen();

  const suggestedQuestions = () =>
    suggestionsResult.data?.meetingChatSuggestions ?? [];

  const isSuggestionsLoading = () =>
    suggestionsResult.fetching && !suggestionsResult.data;

  return {
    setBoundary,
    fabPoint: fab.point,
    isFabDragging: fab.isDragging,
    fabHandlers: fab.handlers,
    isOpen,
    close,
    panelPlacement,
    messages: chat.messages,
    hasMessages: chat.hasMessages,
    suggestedQuestions,
    isSuggestionsLoading,
    showSuggestions,
    followUps: chat.followUps,
    isThinking: chat.isThinking,
    isAnswering: chat.isAnswering,
    showAnsweringBadge,
    draft: chat.draft,
    setDraft: chat.setDraft,
    canSend: chat.canSend,
    copyMessage: chat.copyMessage,
    isCopied: chat.isCopied,
    ask: chat.ask,
    submit: chat.submit,
    clear: chat.clear,
    seek: deps.onSeek,
    setBody: chat.setBody,
    setInput: chat.setInput,
    onInputKeyDown: chat.onInputKeyDown,
  };
};
