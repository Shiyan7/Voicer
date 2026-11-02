import { useToasts } from '@/entities/toasts';
import { useDeleteConfirmation } from '@/shared/hooks/useDeleteConfirmation';
import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';

import { deleteMeetingMutation } from '../api/deleteMeetingMutation';

export const useMeetingDelete = (onDeleted?: () => void) => {
  const toasts = useToasts();
  const [deleteResult, deleteMeeting] = deleteMeetingMutation();

  const { request, confirm, cancel } = useDeleteConfirmation({
    modalId: MODALS.DELETE_MEETING,
    remove: (id) => deleteMeeting({ id }),
    onSuccess: () => {
      toasts.show('success', i18n.t('meetings.delete.success'));
      onDeleted?.();
    },
    onError: () => toasts.show('error', i18n.t('meetings.delete.error')),
  });

  const isDeleting = () => deleteResult.fetching;

  return { isDeleting, request, confirm, cancel };
};
