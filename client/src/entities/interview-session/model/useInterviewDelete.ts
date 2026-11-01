import { useToasts } from '@/entities/toasts';
import { useDeleteConfirmation } from '@/shared/hooks/useDeleteConfirmation';
import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';

import { deleteInterviewSessionMutation } from '../api/deleteInterviewSessionMutation';

export const useInterviewDelete = (onDeleted?: () => void) => {
  const toasts = useToasts();
  const [deleteResult, deleteSession] = deleteInterviewSessionMutation();

  const { request, confirm, cancel } = useDeleteConfirmation({
    modalId: MODALS.DELETE_INTERVIEW,
    remove: (id) => deleteSession({ id }),
    onSuccess: () => {
      toasts.show('success', i18n.t('live.delete.success'));
      onDeleted?.();
    },
    onError: () => toasts.show('error', i18n.t('live.delete.error')),
  });

  const isDeleting = () => deleteResult.fetching;

  return { isDeleting, request, confirm, cancel };
};
