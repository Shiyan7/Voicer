import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';
import {
  ConfirmDeleteModal,
  type DeleteModalActions,
} from '@/shared/ui/confirm-delete-modal';

export function DeleteInterviewModal(props: DeleteModalActions) {
  return (
    <ConfirmDeleteModal
      modalId={MODALS.DELETE_INTERVIEW}
      title={i18n.t('live.delete.title')}
      description={i18n.t('live.delete.description')}
      isDeleting={props.isDeleting}
      onConfirm={props.onConfirm}
      onCancel={props.onCancel}
    />
  );
}
