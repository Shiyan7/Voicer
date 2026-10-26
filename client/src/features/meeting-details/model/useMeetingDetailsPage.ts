import { MeetingStatus } from '@schema';
import { useNavigate, useParams } from '@solidjs/router';
import { createSignal } from 'solid-js';

import { mapMeeting } from '@/entities/meeting';
import { usePlayback } from '@/entities/meeting-player';
import { paths } from '@/shared/router';
import { getSpeakerTone } from '@/shared/ui/speaker-avatar';

import { meetingActionItemsQuery } from '../api/meetingActionItemsQuery';
import { meetingKeyPointsQuery } from '../api/meetingKeyPointsQuery';
import { meetingTranscriptQuery } from '../api/meetingTranscriptQuery';
import { meetingUpdatedSubscription } from '../api/meetingUpdatedSubscription';
import { getMeetingTabs } from '../config/getMeetingTabs';
import { MeetingTab } from '../types/MeetingTab';

export const useMeetingDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const [meetingResult] = meetingUpdatedSubscription(() => ({ id: params.id }));
  const [activeTab, setActiveTab] = createSignal<MeetingTab>('recording');

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
    showNotesEmpty,
    isTranscriptLoading,
    playback,
    currentTimeMs,
    seekToMs,
  };
};
