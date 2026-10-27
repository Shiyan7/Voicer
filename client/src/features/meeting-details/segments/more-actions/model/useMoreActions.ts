import { useNavigate } from '@solidjs/router';
import { useClient } from '@urql/solid';
import { createSignal } from 'solid-js';

import {
  deleteMeetingMutation,
  setMeetingFavoriteMutation,
} from '@/entities/meeting';
import { useToasts } from '@/entities/toasts';
import { fetchMeetingTranscript } from '@/features/meeting-details/api/fetchMeetingTranscript';
import { i18n } from '@/shared/i18n';
import { closeModal, MODALS, showModal } from '@/shared/lib/modal';
import { paths } from '@/shared/router';

import { buildTranscriptText } from '../lib/buildTranscriptText';
import { getMoreActionOptions } from '../lib/getMoreActionOptions';
import {
  revealAudioInDownloads,
  revealTextInDownloads,
} from '../lib/saveToDownloads';
import { MoreAction } from '../types/MoreAction';
import { MoreActionsDeps } from '../types/MoreActionsDeps';

export const useMoreActions = (props: MoreActionsDeps) => {
  const navigate = useNavigate();
  const toasts = useToasts();
  const client = useClient();
  const [, setFavorite] = setMeetingFavoriteMutation();
  const [deleteResult, deleteMeeting] = deleteMeetingMutation();
  const [isBusy, setIsBusy] = createSignal(false);

  const isDeleting = () => deleteResult.fetching;

  const options = () =>
    getMoreActionOptions(props.isFavorite, Boolean(props.audioUrl));

  const runExclusive = async (task: () => Promise<void>) => {
    if (isBusy()) return;

    setIsBusy(true);
    try {
      await task();
    } finally {
      setIsBusy(false);
    }
  };

  const showInFinder = (audioUrl: string) =>
    runExclusive(() => revealAudioInDownloads(audioUrl, props.fileName));

  const exportText = () =>
    runExclusive(async () => {
      const segments = await fetchMeetingTranscript(client, props.meetingId);
      await revealTextInDownloads(
        buildTranscriptText(props.fileName, segments),
        props.fileName,
      );
    });

  const toggleFavorite = () =>
    setFavorite({ id: props.meetingId, isFavorite: !props.isFavorite });

  const selectAction = (action: MoreAction) => {
    if (action === 'favorite') void toggleFavorite();
    if (action === 'export-text') void exportText();
    if (action === 'delete') showModal(MODALS.DELETE_MEETING);
    if (action === 'show-in-finder' && props.audioUrl) {
      void showInFinder(props.audioUrl);
    }
  };

  const confirmDelete = async () => {
    const result = await deleteMeeting({ id: props.meetingId });
    if (result.error) {
      toasts.show('error', i18n.t('meetings.delete.error'));
      return;
    }

    closeModal(MODALS.DELETE_MEETING);
    toasts.show('success', i18n.t('meetings.delete.success'));
    navigate(paths.meetings);
  };

  const cancelDelete = () => closeModal(MODALS.DELETE_MEETING);

  return {
    options,
    selectAction,
    isDeleting,
    confirmDelete,
    cancelDelete,
  };
};
