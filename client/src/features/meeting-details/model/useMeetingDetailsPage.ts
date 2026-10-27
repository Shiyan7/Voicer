import { MeetingStatus } from '@schema';
import { useNavigate, useParams, useSearchParams } from '@solidjs/router';
import { createEffect, createSignal, on } from 'solid-js';

import { mapMeeting } from '@/entities/meeting';
import { usePlayback } from '@/entities/meeting-player';
import { useToasts } from '@/entities/toasts';
import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';
import { getSpeakerTone } from '@/shared/ui/speaker-avatar';

import { meetingActionItemsQuery } from '../api/meetingActionItemsQuery';
import { meetingKeyPointsQuery } from '../api/meetingKeyPointsQuery';
import { meetingTranscriptQuery } from '../api/meetingTranscriptQuery';
import { meetingUpdatedSubscription } from '../api/meetingUpdatedSubscription';
import { getMeetingTabs } from '../config/getMeetingTabs';
import { toMeetingTab } from '../lib/toMeetingTab';
import { MeetingDetailsSearchParams } from '../types/MeetingDetailsSearchParams';
import { MeetingTab } from '../types/MeetingTab';
import { NotesState } from '../types/NotesState';

export const useMeetingDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const [meetingResult] = meetingUpdatedSubscription(() => ({ id: params.id }));
  const [searchParams] = useSearchParams<MeetingDetailsSearchParams>();
  const [activeTab, setActiveTab] = createSignal<MeetingTab>(
    toMeetingTab(searchParams.tab),
  );

  const focusId = () => searchParams.focus ?? null;

  const meeting = () => mapMeeting(meetingResult.data?.meetingUpdated);

  const isLoading = () => meetingResult.fetching && !meeting();

  const isEmpty = () => !meetingResult.fetching && !meeting();

  const status = () => meeting()?.status;

  const isTranscribing = () => status() === MeetingStatus.Transcribing;

  const isTranscribed = () => status() === MeetingStatus.Transcribed;

  const isSummarizing = () => status() === MeetingStatus.Summarizing;

  const isReady = () => status() === MeetingStatus.Ready;

  const isFailed = () => status() === MeetingStatus.Failed;

  const hasContent = () => isTranscribed() || isSummarizing() || isReady();

  const summarizationFailed = () => meeting()?.summarizationFailed;

  const toasts = useToasts();

  createEffect(
    on(summarizationFailed, (failed) => {
      if (failed) {
        toasts.show('error', i18n.t('meetings.summarize_error'));
      }
    }),
  );

  const [transcriptResult] = meetingTranscriptQuery(
    () => ({ meetingId: params.id }),
    { pause: () => !hasContent() },
  );

  const transcript = () => transcriptResult.data?.meetingTranscript ?? [];

  const speakerTones = () =>
    [...new Set(transcript().map((segment) => segment.speakerIndex))]
      .sort((a, b) => a - b)
      .map(getSpeakerTone);

  const [actionItemsResult] = meetingActionItemsQuery(
    () => ({ meetingId: params.id }),
    { pause: () => !isReady() },
  );

  const [keyPointsResult] = meetingKeyPointsQuery(
    () => ({ meetingId: params.id }),
    { pause: () => !isReady() },
  );

  const actionItems = () => actionItemsResult.data?.meetingActionItems ?? [];

  const keyPoints = () => keyPointsResult.data?.meetingKeyPoints ?? [];

  const isNotesLoading = () =>
    actionItemsResult.fetching || keyPointsResult.fetching;

  const hasNotes = () => actionItems().length > 0 || keyPoints().length > 0;

  const showNotesEmpty = () =>
    isTranscribed() || (isReady() && !isNotesLoading() && !hasNotes());

  const notesState = (): NotesState => {
    if (isSummarizing()) return 'loading';
    if (showNotesEmpty()) return 'empty';
    return 'content';
  };

  const isTranscriptLoading = () => transcriptResult.fetching;

  const playback = usePlayback();

  const currentTimeMs = () => playback.currentTime() * 1000;

  const seekToMs = (ms: number) => playback.seek(ms / 1000, { play: true });

  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(paths.meetings);
  };

  const goToNotesTab = () => setActiveTab('notes');

  return {
    meeting,
    isLoading,
    isEmpty,
    isTranscribing,
    isTranscribed,
    isSummarizing,
    isReady,
    isFailed,
    hasContent,
    activeTab,
    setActiveTab,
    goToNotesTab,
    goBack,
    tabs: getMeetingTabs,
    transcript,
    speakerTones,
    actionItems,
    keyPoints,
    notesState,
    isTranscriptLoading,
    playback,
    currentTimeMs,
    seekToMs,
    focusId,
  };
};
