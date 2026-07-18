import { MeetingStatus } from '@schema';
import { useParams } from '@solidjs/router';
import { createSignal } from 'solid-js';

import { mapMeeting } from '@/entities/meeting';
import { i18n } from '@/shared/i18n';

import { meetingUpdatedSubscription } from '../api/meetingUpdatedSubscription';
import { getMeetingTabs } from '../config/getMeetingTabs';
import { MeetingTab } from '../types/MeetingTab';

const PROCESSING_STATUSES = [
  MeetingStatus.Transcribing,
  MeetingStatus.Summarizing,
];

export const useMeetingDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const [meetingResult] = meetingUpdatedSubscription({ id: params.id });
  const [activeTab, setActiveTab] = createSignal<MeetingTab>('notes');

  const meeting = () => mapMeeting(meetingResult.data?.meetingUpdated);

  const isLoading = () => meetingResult.fetching && !meeting();

  const isEmpty = () => !meetingResult.fetching && !meeting();

  const isReady = () => meeting()?.status === MeetingStatus.Ready;

  const isFailed = () => meeting()?.status === MeetingStatus.Failed;

  const processingStatus = () => {
    const status = meeting()?.status;
    return status && PROCESSING_STATUSES.includes(status) ? status : null;
  };

  const processingLabel = () =>
    processingStatus() === MeetingStatus.Summarizing
      ? i18n.t('meetings.status.summarizing')
      : i18n.t('meetings.status.transcribing');

  return {
    meeting,
    isLoading,
    isEmpty,
    isReady,
    isFailed,
    processingStatus,
    processingLabel,
    activeTab,
    setActiveTab,
    tabs: getMeetingTabs,
  };
};
