import { createSignal } from 'solid-js';

import { useToasts } from '@/entities/toasts';
import { useDeleteConfirmation } from '@/shared/hooks/useDeleteConfirmation';
import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';

import { deleteInterviewResumeMutation } from '../api/deleteInterviewResumeMutation';
import { interviewResumesQuery } from '../api/interviewResumesQuery';
import { PrepResumeOption } from '../types/PrepResumeOption';

export function useSavedResumes() {
  const toasts = useToasts();
  const [resumesState, refetchResumes] = interviewResumesQuery();
  const [selectedId, setSelectedId] = createSignal<string>();
  const [deleteState, deleteResume] = deleteInterviewResumeMutation();

  const remove = async (sessionId: string) => {
    const result = await deleteResume({ sessionId });
    if (!result.error && selectedId() === sessionId) setSelectedId(undefined);
    return result;
  };

  const { request, confirm, cancel } = useDeleteConfirmation({
    modalId: MODALS.DELETE_RESUME,
    remove,
    onSuccess: () => {
      toasts.show('success', i18n.t('live.prep.resume_delete.success'));
      refetchResumes({ requestPolicy: 'network-only' });
    },
    onError: () =>
      toasts.show('error', i18n.t('live.prep.resume_delete.error')),
  });

  const options = (): PrepResumeOption[] =>
    (resumesState.data?.interviewResumes ?? []).map((item) => ({
      id: item.sessionId,
      label: item.fileName ?? '',
    }));

  const selectedLabel = () =>
    options().find((option) => option.id === selectedId())?.label;

  const isDeleting = () => deleteState.fetching;

  return {
    options,
    selectedId,
    selectedLabel,
    setSelectedId,
    isDeleting,
    requestDelete: request,
    confirmDelete: confirm,
    cancelDelete: cancel,
  };
}
