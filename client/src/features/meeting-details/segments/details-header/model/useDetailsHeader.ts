import { createEffect, createSignal, on } from 'solid-js';

import {
  renameMeetingMutation,
  suggestMeetingTitleMutation,
} from '@/entities/meeting';
import { useToasts } from '@/entities/toasts';
import { i18n } from '@/shared/i18n';
import { formatDurationLabel, formatShortDateTime } from '@/shared/lib/time';

import { DetailsHeaderDeps } from '../types/DetailsHeaderDeps';

export const useDetailsHeader = (props: DetailsHeaderDeps) => {
  const toasts = useToasts();
  const [, renameMeeting] = renameMeetingMutation();
  const [suggestResult, suggestTitle] = suggestMeetingTitleMutation();
  const [isEditing, setIsEditing] = createSignal(false);
  const [draft, setDraft] = createSignal('');
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>();

  const title = () => props.meeting.title;

  const customTitle = () => props.meeting.customTitle ?? '';

  const [isTitleRevealing, setIsTitleRevealing] = createSignal(false);

  createEffect(
    on(customTitle, (current, previous) => {
      const isTitleGenerated = previous === '' && current !== '';
      if (isTitleGenerated) setIsTitleRevealing(true);
    }),
  );

  const finishTitleReveal = () => setIsTitleRevealing(false);

  const isSuggesting = () => suggestResult.fetching;

  const sourceLabel = () => props.meeting.sourceLabel;

  const dateLabel = () => formatShortDateTime(props.meeting.startedAt);

  const durationLabel = () => {
    const duration = props.meeting.durationSec;
    return duration ? formatDurationLabel(duration) : null;
  };

  const speakersLabel = () =>
    i18n.t('meetings.speakers_count', {
      count: props.speakerTones.length.toString(),
    });

  const hasSpeakers = () => props.speakerTones.length > 0;

  const focusInput = () =>
    requestAnimationFrame(() => {
      inputRef()?.focus();
      inputRef()?.select();
    });

  const startEditing = () => {
    setDraft(customTitle());
    setIsEditing(true);
    focusInput();
  };

  const cancelEditing = () => setIsEditing(false);

  const saveTitle = async () => {
    if (!isEditing()) return;
    setIsEditing(false);

    const next = draft().trim();
    if (next === customTitle()) return;

    const result = await renameMeeting({
      id: props.meeting.id,
      title: next || null,
    });
    if (result.error) toasts.show('error', i18n.t('meetings.rename_error'));
  };

  const suggestWithAi = async () => {
    const result = await suggestTitle({ id: props.meeting.id });
    const suggestion = result.data?.meetingSuggestTitle;

    if (!suggestion) {
      toasts.show('error', i18n.t('meetings.suggest_title_error'));
      return;
    }

    setDraft(suggestion);
    focusInput();
  };

  const keepInputFocus = (event: MouseEvent) => event.preventDefault();

  const onDraftInput = (event: InputEvent) =>
    setDraft((event.currentTarget as HTMLInputElement).value);

  const onDraftKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') void saveTitle();
    if (event.key === 'Escape') cancelEditing();
  };

  return {
    title,
    isTitleRevealing,
    finishTitleReveal,
    draft,
    isEditing,
    isSuggesting,
    sourceLabel,
    dateLabel,
    durationLabel,
    speakersLabel,
    hasSpeakers,
    setInputRef,
    startEditing,
    saveTitle,
    suggestWithAi,
    keepInputFocus,
    onDraftInput,
    onDraftKeyDown,
  };
};
