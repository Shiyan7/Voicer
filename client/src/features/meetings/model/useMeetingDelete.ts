import { createSignal } from 'solid-js';

import { deleteMeetingMutation } from '@/entities/meeting';
import { useToasts } from '@/entities/toasts';
import { i18n } from '@/shared/i18n';
import { closeModal, MODALS, showModal } from '@/shared/lib/modal';

export const useMeetingDelete = () => {
  const toasts = useToasts();
  const [deleteResult, deleteMeeting] = deleteMeetingMutation();
  const [pendingDeleteId, setPendingDeleteId] = createSignal<string | null>(
    null,
  );

  const isDeleting = () => deleteResult.fetching;

  const requestDeleteMeeting = (id: string) => {
    setPendingDeleteId(id);
    showModal(MODALS.DELETE_MEETING);
  };

  const cancelDeleteMeeting = () => setPendingDeleteId(null);

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
    isDeleting,
    requestDeleteMeeting,
    cancelDeleteMeeting,
    confirmDeleteMeeting,
  };
};
