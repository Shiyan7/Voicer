import { MeetingStatus } from '@schema';
import { useParams } from '@solidjs/router';
import { createSignal } from 'solid-js';

import { mapMeeting } from '@/entities/meeting';

import { meetingQuery } from '../api/meetingQuery';
import { getMeetingTabs } from '../config/getMeetingTabs';
import { MeetingTab } from '../types/MeetingTab';

export const useMeetingDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const [meetingResult] = meetingQuery({ id: params.id });
  const [activeTab, setActiveTab] = createSignal<MeetingTab>('notes');

  const meeting = () => mapMeeting(meetingResult.data?.meeting);

  const isLoading = () => meetingResult.fetching;

  const isEmpty = () => !isLoading() && !meeting();

  const isReady = () => meeting()?.status === MeetingStatus.Ready;

  return {
    meeting,
    isLoading,
    isEmpty,
    isReady,
    activeTab,
    setActiveTab,
    tabs: getMeetingTabs,
  };
}
