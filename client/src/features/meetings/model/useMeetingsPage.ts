import type { MeetingOutput } from '@schema';
import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';

import { uploadMeetingAudioMutation } from '@/entities/meeting';
import { useInfiniteScroll } from '@/shared/lib/infinite-scroll';
import { closeModal, MODALS, showModal } from '@/shared/lib/modal';
import { startRecording as startRecorderCommand } from '@/shared/lib/recorder';
import { authRoot } from '@/shared/roots/authRoot';
import { paths } from '@/shared/router';

import { deleteMeetingMutation } from '../api/deleteMeetingMutation';
import { meetingsPageQuery } from '../api/meetingsPageQuery';
import { mapMeetingCards } from '../lib/mapMeetingCards';

const PAGE_LIMIT = 10;

export const useMeetingsPage = () => {
  const [afterCursor, setAfterCursor] = createSignal<string | null>(null);

  const [meetingsResult] = meetingsPageQuery(
    () => ({ input: { afterCursor: afterCursor(), limit: PAGE_LIMIT } }),
    { pause: () => !authRoot.isAuth },
  );

  const page = () => meetingsResult.data?.meetingsPage;
  const hasMore = () => Boolean(page()?.meta.hasNextItems);

  const infinite = useInfiniteScroll<MeetingOutput>({
    items: () => page()?.items,
    hasMore,
    isFetching: () => meetingsResult.fetching,
    loadMore: () => setAfterCursor(page()?.meta.nextCursor ?? null),
  });

  const [uploadResult, uploadAudio] = uploadMeetingAudioMutation();
  const [deleteResult, deleteMeeting] = deleteMeetingMutation();
  const [pendingDeleteId, setPendingDeleteId] = createSignal<string | null>(
    null,
  );

  const navigate = useNavigate();

  const items = () => mapMeetingCards(infinite.accumulated());

  const isLoading = () => meetingsResult.fetching && !items().length;

  const isEmpty = () =>
    !meetingsResult.fetching && infinite.accumulated().length === 0;

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

  const openMeeting = (id: string) => {
    navigate(paths.meeting(id));
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
    hasMore,
    isUploading,
    isDeleting,
    startRecording,
    openMeeting,
    onFileSelected,
    requestDeleteMeeting,
    cancelDeleteMeeting,
    confirmDeleteMeeting,
    setTriggerRef: infinite.setTriggerRef,
  };
};
