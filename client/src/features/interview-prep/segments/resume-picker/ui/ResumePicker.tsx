import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';
import { ConfirmDeleteModal } from '@/shared/ui/confirm-delete-modal';
import { FileInput } from '@/shared/ui/file-input';

import { ResumePickerProps } from '../types/ResumePickerProps';
import { PrepResumeTiles } from './PrepResumeTiles';

export function ResumePicker(props: ResumePickerProps) {
  return (
    <>
      <ConfirmDeleteModal
        modalId={MODALS.DELETE_RESUME}
        title={i18n.t('live.prep.resume_delete.title')}
        description={i18n.t('live.prep.resume_delete.description')}
        isDeleting={props.isDeleting}
        onConfirm={props.onConfirmDelete}
        onCancel={props.onCancelDelete}
      />
      <FileInput
        label={props.label}
        accept="application/pdf"
        isFilled={props.isFilled}
        onSelect={props.onSelectFile}
      />
      <PrepResumeTiles
        options={props.options}
        selectedId={props.selectedId}
        onSelect={props.onSelectSaved}
        onDelete={props.onRequestDelete}
      />
    </>
  );
}
