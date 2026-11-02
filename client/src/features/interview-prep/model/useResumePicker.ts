import { useToasts } from '@/entities/toasts';
import { useDeleteConfirmation } from '@/shared/hooks/useDeleteConfirmation';
import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';

import { deleteInterviewResumeMutation } from '../api/deleteInterviewResumeMutation';
import { interviewResumesQuery } from '../api/interviewResumesQuery';
import { ResumeSelection } from '../types/ResumeSelection';

export function useResumePicker(
  selection: () => ResumeSelection | undefined,
  onChange: (selection: ResumeSelection | undefined) => void,
) {
  const toasts = useToasts();
  const [resumesState, refetchResumes] = interviewResumesQuery();
  const [deleteState, deleteResume] = deleteInterviewResumeMutation();

  const selectedResumeId = () => {
    const current = selection();
    return current?.kind === 'saved' ? current.id : undefined;
  };

  const remove = async (sessionId: string) => {
    const result = await deleteResume({ sessionId });
    if (!result.error && selectedResumeId() === sessionId) {
      onChange(undefined);
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

  const resumeOptions = () =>
    (resumesState.data?.interviewResumes ?? []).map((item) => ({
      id: item.sessionId,
      label: item.fileName,
    }));

  const resumeLabel = () => {
    const current = selection();
    if (current?.kind === 'file') return current.file.name;
    return (
      resumeOptions().find((option) => option.id === selectedResumeId())
        ?.label ?? i18n.t('live.prep.resume_placeholder')
    );
  };

  const hasResume = () => !!selection();

  const isDeletingResume = () => deleteState.fetching;

  const selectResumeFile = (file: File) => onChange({ kind: 'file', file });

  const selectSavedResume = (id: string) => onChange({ kind: 'saved', id });

  return {
    resumeOptions,
    selectedResumeId,
    resumeLabel,
    hasResume,
    isDeletingResume,
    selectResumeFile,
    selectSavedResume,
    requestResumeDelete: request,
    confirmResumeDelete: confirm,
    cancelResumeDelete: cancel,
  };
}
