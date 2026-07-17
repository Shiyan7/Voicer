import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';

import { closeModal, MODALS, showModal } from '@/shared/lib/modal';
import { paths } from '@/shared/router';

import { deleteMeetingMutation } from '../api/deleteMeetingMutation';
import { meetingsQuery } from '../api/meetingsQuery';
import { uploadMeetingMutation } from '../api/uploadMeetingMutation';
import { mapMeetingCards } from '../lib/mapMeetingCards';

export const useMeetingsPage = () => {
  const [meetingsResult] = meetingsQuery();
  const [uploadResult, uploadMeeting] = uploadMeetingMutation();
  const [deleteResult, deleteMeeting] = deleteMeetingMutation();
  const [pendingDeleteId, setPendingDeleteId] = createSignal<string | null>(
    null,
  );

  const navigate = useNavigate();

  const isLoading = () => meetingsResult.fetching;

  const items = () => mapMeetingCards(meetingsResult.data?.meetings);

  const isEmpty = () => !meetingsResult.fetching && !items().length;

  const isUploading = () => uploadResult.fetching;

  const isDeleting = () => deleteResult.fetching;

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

  const requestDeleteMeeting = (id: string) => {
    setPendingDeleteId(id);
    showModal(MODALS.DELETE_MEETING);
  };

  const cancelDeleteMeeting = () => {
    setPendingDeleteId(null);
  };

  const confirmDeleteMeeting = async () => {
    const id = pendingDeleteId();
    if (!id) return;

    await deleteMeeting({ id });
    closeModal(MODALS.DELETE_MEETING);
    setPendingDeleteId(null);
  };

  return {
    items,
    isLoading,
    isEmpty,
    isUploading,
    isDeleting,
    startRecording,
    openMeeting,
    onFileSelected,
    requestDeleteMeeting,
    cancelDeleteMeeting,
    confirmDeleteMeeting,
  };
};
