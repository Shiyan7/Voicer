import { createSignal } from 'solid-js';

import { uploadMeetingAudioMutation } from '@/entities/meeting';
import { closeModal, MODALS, showModal } from '@/shared/lib/modal';
import { startRecording as startRecorderCommand } from '@/shared/lib/recorder';
import { authRoot } from '@/shared/roots/authRoot';

import { deleteMeetingMutation } from '../api/deleteMeetingMutation';
import { meetingsPageQuery } from '../api/meetingsPageQuery';
import { mapMeetingCards } from '../lib/mapMeetingCards';

const PAGE_LIMIT = 10;

export const useMeetingsPage = () => {
  const [page, setPage] = createSignal(1);

  const [meetingsResult, refetchMeetings] = meetingsPageQuery(
    () => ({ input: { page: page(), limit: PAGE_LIMIT } }),
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

  const currentPage = () => meetingsPage()?.meta.page ?? page();

  const hasPrevPage = () => Boolean(meetingsPage()?.meta.hasPrevItems);

  const hasNextPage = () => Boolean(meetingsPage()?.meta.hasNextItems);

  const isLoading = () => meetingsResult.fetching && !items().length;

  const isEmpty = () => !meetingsResult.fetching && items().length === 0;

  const isUploading = () => uploadResult.fetching;

  const isDeleting = () => deleteResult.fetching;

  const reloadFirstPage = () => {
    setPage(1);
    refetchMeetings({ requestPolicy: 'network-only' });
  };

  const goToPrevPage = () => {
    if (!hasPrevPage()) return;
    setPage((current) => Math.max(1, current - 1));
  };

  const goToNextPage = () => {
    if (!hasNextPage()) return;
    setPage((current) => current + 1);
  };

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
    reloadFirstPage();
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

    const wasLastOnPage = meetings().length === 1;

    await deleteMeeting({ id });
    closeModal(MODALS.DELETE_MEETING);
    setPendingDeleteId(null);

    if (wasLastOnPage && page() > 1) {
      setPage((current) => current - 1);
      return;
    }

    refetchMeetings({ requestPolicy: 'network-only' });
  };

  return {
    items,
    isLoading,
    isEmpty,
    currentPage,
    hasPrevPage,
    hasNextPage,
    isUploading,
    isDeleting,
    startRecording,
    onFileSelected,
    requestDeleteMeeting,
    cancelDeleteMeeting,
    confirmDeleteMeeting,
    goToPrevPage,
    goToNextPage,
  };
};
