import { createSignal } from 'solid-js';

import { useKeydown } from '@/shared/lib/dom';

import { getPanelPlacement } from '../lib/getPanelPlacement';
import { MeetingChatProps } from '../types/MeetingChatProps';
import { useChatMessages } from './useChatMessages';
import { useChatScroll } from './useChatScroll';
import { useDraggableFab } from './useDraggableFab';

export const useMeetingChat = (props: MeetingChatProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [hasOpened, setHasOpened] = createSignal(false);
  const [boundary, setBoundary] = createSignal<HTMLElement>();

  const open = () => {
    setHasOpened(true);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const toggle = () => (isOpen() ? close() : open());

  const chat = useChatMessages({
    meetingId: () => props.meetingId,
    isActive: hasOpened,
  });

  const fab = useDraggableFab({
    boundary,
    obstacle: () => props.obstacle,
    onTap: toggle,
  });

  const submit = () => void chat.ask(chat.draft());

  const scroll = useChatScroll({
    isOpen,
    draft: chat.draft,
    scrollTrigger: chat.questionCount,
    onSubmit: submit,
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
    suggestedQuestions: chat.suggestedQuestions,
    isSuggestionsLoading: chat.isSuggestionsLoading,
    showSuggestions: () => !chat.hasMessages(),
    followUps: chat.followUps,
    isThinking: chat.isThinking,
    isAnswering: chat.isAnswering,
    showAnsweringBadge: () => chat.isAnswering() && !isOpen(),
    draft: chat.draft,
    setDraft: chat.setDraft,
    canSend: () => Boolean(chat.draft().trim()) && !chat.isAnswering(),
    ask: chat.ask,
    submit,
    clear: chat.clear,
    seek: props.onSeek,
    setBody: scroll.setBody,
    setInput: scroll.setInput,
    onInputKeyDown: scroll.onInputKeyDown,
  };
};
