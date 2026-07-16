import { meetingsQuery } from '../api/meetingsQuery';
import { mapMeetingCards } from '../lib/mapMeetingCards';

export function useMeetingsPage() {
  const [meetingsResult] = meetingsQuery();

  const isLoading = () => meetingsResult.fetching;

  const items = () => mapMeetingCards(meetingsResult.data?.meetings);

  const isEmpty = () => !meetingsResult.fetching && !meetingsResult.data;

  const isUploading = (): boolean => false;

  const canUpload = (): boolean => false;

  const canRecord = (): boolean => false;

  const startRecording = () => {};

  const openMeeting = (id: string) => {};

  const onFileSelected = (event: Event) => {};

  return {
    items,
    isLoading,
    isEmpty,
    isUploading,
    canUpload,
    canRecord,
    startRecording,
    openMeeting,
    onFileSelected,
  };
}
