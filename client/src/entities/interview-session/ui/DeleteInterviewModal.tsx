import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';
import { ConfirmDeleteModal } from '@/shared/ui/confirm-delete-modal';

interface DeleteInterviewModalProps {
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteInterviewModal(props: DeleteInterviewModalProps) {
  return (
    <ConfirmDeleteModal
      modalId={MODALS.DELETE_INTERVIEW}
      title={i18n.t('live.delete.title')}
      description={i18n.t('live.delete.description')}
      confirmLabel={i18n.t('meetings.delete.confirm')}
      cancelLabel={i18n.t('meetings.delete.cancel')}
      isDeleting={props.isDeleting}
      onConfirm={props.onConfirm}
      onCancel={props.onCancel}
    />
  );
}
