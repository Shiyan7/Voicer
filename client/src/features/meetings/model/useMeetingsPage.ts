import { createSignal } from 'solid-js';

import {
  deleteMeetingMutation,
  uploadMeetingAudioMutation,
} from '@/entities/meeting';
import { useToasts } from '@/entities/toasts';
import { useQueryPagination } from '@/shared/hooks/useQueryPagination';
import { i18n } from '@/shared/i18n';
import { closeModal, MODALS, showModal } from '@/shared/lib/modal';
import { startRecording as startRecorderCommand } from '@/shared/lib/recorder';
import { authRoot } from '@/shared/roots/authRoot';

import { meetingsPageQuery } from '../api/meetingsPageQuery';
import { mapMeetingCards } from '../lib/mapMeetingCards';
import { MeetingsDeps } from '../types/MeetingsDeps';

export const useMeetingsPage = (props: MeetingsDeps) => {
  const toasts = useToasts();
  const pagination = useQueryPagination(() => meetingsPage()?.meta);

  const [meetingsResult] = meetingsPageQuery(
    () => ({
      input: {
        page: pagination.page(),
        limit: pagination.limit,
        favoritesOnly: Boolean(props.favoritesOnly),
      },
    }),
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

  const title = () =>
    props.favoritesOnly ? i18n.t('favorites.title') : i18n.t('meetings.title');

  const emptyLabel = () =>
    props.favoritesOnly ? i18n.t('favorites.empty') : i18n.t('meetings.empty');

  const showToolbar = () => !props.favoritesOnly;

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

    const result = await deleteMeeting({ id });
    if (result.error) {
      toasts.show('error', i18n.t('meetings.delete.error'));
      return;
    }

    closeModal(MODALS.DELETE_MEETING);
    setPendingDeleteId(null);
    toasts.show('success', i18n.t('meetings.delete.success'));
  };

  return {
    title,
    emptyLabel,
    showToolbar,
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
