import { useToasts } from '@/entities/toasts';
import { useDeleteConfirmation } from '@/shared/hooks/useDeleteConfirmation';
import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';

import { deleteInterviewResumeMutation } from '../../../api/deleteInterviewResumeMutation';
import { interviewResumesQuery } from '../../../api/interviewResumesQuery';
import { ResumePickerDeps } from '../types/ResumePickerDeps';

export function useResumePicker(deps: ResumePickerDeps) {
  const toasts = useToasts();
  const [resumesState, refetchResumes] = interviewResumesQuery();
  const [deleteState, deleteResume] = deleteInterviewResumeMutation();

  const selectedId = () => {
    const current = deps.selection;
    return current?.kind === 'saved' ? current.id : undefined;
  };

  const remove = async (sessionId: string) => {
    const result = await deleteResume({ sessionId });
    if (!result.error && selectedId() === sessionId) {
      deps.onChange(undefined);
    }
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

  const options = () =>
    (resumesState.data?.interviewResumes ?? []).map((item) => ({
      id: item.sessionId,
      label: item.fileName,
    }));

  const label = () => {
    const current = deps.selection;
    if (current?.kind === 'file') return current.file.name;
    return (
      options().find((option) => option.id === selectedId())?.label ??
      i18n.t('live.prep.resume_placeholder')
    );
  };

  const isFilled = () => !!deps.selection;

  const isDeleting = () => deleteState.fetching;

  const selectFile = (file: File) => deps.onChange({ kind: 'file', file });

  const selectSaved = (id: string) => deps.onChange({ kind: 'saved', id });

  return {
    options,
    selectedId,
    label,
    isFilled,
    isDeleting,
    selectFile,
    selectSaved,
    requestDelete: request,
    confirmDelete: confirm,
    cancelDelete: cancel,
  };
}
