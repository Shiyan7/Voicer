import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';
import { ConfirmDeleteModal } from '@/shared/ui/confirm-delete-modal';
import { FileInput } from '@/shared/ui/file-input';

import { useResumePicker } from '../model/useResumePicker';
import { ResumePickerDeps } from '../types/ResumePickerDeps';
import { PrepResumeTiles } from './PrepResumeTiles';

export function ResumePicker(deps: ResumePickerDeps) {
  const vm = useResumePicker(deps);

  return (
    <>
      <ConfirmDeleteModal
        modalId={MODALS.DELETE_RESUME}
        title={i18n.t('live.prep.resume_delete.title')}
        description={i18n.t('live.prep.resume_delete.description')}
        isDeleting={vm.isDeleting()}
        onConfirm={vm.confirmDelete}
        onCancel={vm.cancelDelete}
      />
      <FileInput
        label={vm.label()}
        accept="application/pdf"
        isFilled={vm.isFilled()}
        onSelect={vm.selectFile}
      />
      <PrepResumeTiles
        options={vm.options()}
        selectedId={vm.selectedId()}
        onSelect={vm.selectSaved}
        onDelete={vm.requestDelete}
      />
    </>
  );
}
