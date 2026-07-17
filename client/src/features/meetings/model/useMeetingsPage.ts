import { useNavigate } from '@solidjs/router';

import { paths } from '@/shared/router';

import { meetingsQuery } from '../api/meetingsQuery';
import { uploadMeetingMutation } from '../api/uploadMeetingMutation';
import { mapMeetingCards } from '../lib/mapMeetingCards';

export const useMeetingsPage = () => {
  const [meetingsResult] = meetingsQuery();
  const [uploadResult, uploadMeeting] = uploadMeetingMutation();
  const navigate = useNavigate();

  const isLoading = () => meetingsResult.fetching;

  const items = () => mapMeetingCards(meetingsResult.data?.meetings);

  const isEmpty = () => !meetingsResult.fetching && !items().length;

  const isUploading = () => uploadResult.fetching;

  const startRecording = () => {};

  const openMeeting = (id: string) => {
    navigate(paths.meeting(id));
  };

  const onFileSelected = async (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) return;

    await uploadMeeting({ file });
  };

  return {
    items,
    isLoading,
    isEmpty,
    isUploading,
    startRecording,
    openMeeting,
    onFileSelected,
  };
};
