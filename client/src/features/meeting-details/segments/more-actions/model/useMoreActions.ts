import { useNavigate } from '@solidjs/router';
import { downloadDir, join } from '@tauri-apps/api/path';
import { exists, writeFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { revealItemInDir } from '@tauri-apps/plugin-opener';
import { useClient } from '@urql/solid';
import { createSignal } from 'solid-js';

import { deleteMeetingMutation } from '@/entities/meeting';
import { useToasts } from '@/entities/toasts';
import { fetchMeetingTranscript } from '@/features/meeting-details/api/fetchMeetingTranscript';
import { meetingSetFavoriteMutation } from '@/features/meeting-details/api/meetingSetFavoriteMutation';
import { i18n } from '@/shared/i18n';
import { closeModal, MODALS, showModal } from '@/shared/lib/modal';
import { paths } from '@/shared/router';
import { DropdownOption } from '@/shared/ui/dropdown';

import { buildTranscriptText } from '../lib/buildTranscriptText';
import { toFileName } from '../lib/toFileName';
import { MoreAction } from '../types/MoreAction';
import { MoreActionsDeps } from '../types/MoreActionsDeps';

export const useMoreActions = (props: MoreActionsDeps) => {
  const navigate = useNavigate();
  const toasts = useToasts();
  const client = useClient();
  const [, setFavorite] = meetingSetFavoriteMutation();
  const [deleteResult, deleteMeeting] = deleteMeetingMutation();
  const [isBusy, setIsBusy] = createSignal(false);

  const isDeleting = () => deleteResult.fetching;

  const favoriteOption = (): DropdownOption<MoreAction> =>
    props.isFavorite
      ? {
          value: 'favorite',
          label: i18n.t('meetings.remove_favorite'),
          icon: 'navigation:bookmark-solid',
        }
      : {
          value: 'favorite',
          label: i18n.t('meetings.add_favorite'),
          icon: 'navigation:bookmark',
        };

  const options = (): DropdownOption<MoreAction>[] => [
    favoriteOption(),
    ...(props.audioUrl
      ? [
          {
            value: 'show-in-finder' as const,
            label: i18n.t('meetings.show_in_finder'),
            icon: 'common:folder' as const,
          },
        ]
      : []),
    {
      value: 'export-text',
      label: i18n.t('meetings.export_text'),
      icon: 'common:document-text',
    },
    {
      value: 'delete',
      label: i18n.t('meetings.delete_meeting'),
      icon: 'common:trash',
      isDanger: true,
    },
  ];

  const downloadPath = async (extension: string) =>
    join(await downloadDir(), `${toFileName(props.fileName)}.${extension}`);

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
    runExclusive(async () => {
      const path = await downloadPath(audioUrl.split('.').pop() ?? 'mp3');

      if (!(await exists(path))) {
        const response = await fetch(audioUrl);
        await writeFile(path, new Uint8Array(await response.arrayBuffer()));
      }
      await revealItemInDir(path);
    });

  const exportText = () =>
    runExclusive(async () => {
      const segments = await fetchMeetingTranscript(client, props.meetingId);
      const path = await downloadPath('txt');

      await writeTextFile(path, buildTranscriptText(props.fileName, segments));
      await revealItemInDir(path);
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
