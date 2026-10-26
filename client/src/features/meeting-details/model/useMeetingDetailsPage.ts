import { MeetingStatus } from '@schema';
import { useParams } from '@solidjs/router';
import { createSignal } from 'solid-js';

import { mapMeeting } from '@/entities/meeting';

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
    tabs: getMeetingTabs,
  };
};
