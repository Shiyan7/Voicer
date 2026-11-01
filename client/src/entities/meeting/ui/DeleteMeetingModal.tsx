import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';
import { ConfirmDeleteModal } from '@/shared/ui/confirm-delete-modal';

import { DeleteMeetingModalProps } from '../types/DeleteMeetingModalProps';

export function DeleteMeetingModal(props: DeleteMeetingModalProps) {
  return (
    <ConfirmDeleteModal
      modalId={MODALS.DELETE_MEETING}
      title={i18n.t('meetings.delete.title')}
      description={i18n.t('meetings.delete.description')}
      confirmLabel={i18n.t('meetings.delete.confirm')}
      cancelLabel={i18n.t('meetings.delete.cancel')}
      isDeleting={props.isDeleting}
      onConfirm={props.onConfirm}
      onCancel={props.onCancel}
    />
  );
}
