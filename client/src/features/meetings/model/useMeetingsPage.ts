import { createSignal } from 'solid-js';

import { uploadMeetingAudioMutation } from '@/entities/meeting';
import { useQueryPagination } from '@/shared/hooks/useQueryPagination';
import { closeModal, MODALS, showModal } from '@/shared/lib/modal';
import { startRecording as startRecorderCommand } from '@/shared/lib/recorder';
import { authRoot } from '@/shared/roots/authRoot';

import { deleteMeetingMutation } from '../api/deleteMeetingMutation';
import { meetingsPageQuery } from '../api/meetingsPageQuery';
import { mapMeetingCards } from '../lib/mapMeetingCards';

export const useMeetingsPage = () => {
  const pagination = useQueryPagination(() => meetingsPage()?.meta);

  const [meetingsResult] = meetingsPageQuery(
    () => ({ input: { page: pagination.page(), limit: pagination.limit } }),
    { pause: () => !authRoot.isAuth },
  );

  const meetingsPage = () => meetingsResult.data?.meetingsPage;
  const meetings = () => meetingsPage()?.items ?? [];

  const [uploadResult, uploadAudio] = uploadMeetingAudioMutation();
  const [deleteResult, deleteMeeting] = deleteMeetingMutation();
  const [pendingDeleteId, setPendingDeleteId] = createSignal<string | null>(
    null,
  );

  const items = () => mapMeetingCards(meetings());

  const isLoading = () => meetingsResult.fetching && !items().length;

  const isEmpty = () => !meetingsResult.fetching && items().length === 0;

  const isUploading = () => uploadResult.fetching;

  const isDeleting = () => deleteResult.fetching;

  const startRecording = async () => {
    try {
      const result = await startRecorderCommand();
      if (result.warnings.length) {
        console.warn('[recorder] start warnings:', result.warnings);
      }
    } catch (error) {
      console.error('[recorder] failed to start recording:', error);
    }
  };

  const onFileSelected = async (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) return;

    await uploadAudio({ file });
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
    onFileSelected,
    requestDeleteMeeting,
    cancelDeleteMeeting,
    confirmDeleteMeeting,
    currentPage: pagination.currentPage,
    hasPrevPage: pagination.hasPrevPage,
    hasNextPage: pagination.hasNextPage,
    goToPrevPage: pagination.goToPrevPage,
    goToNextPage: pagination.goToNextPage,
  };
};
