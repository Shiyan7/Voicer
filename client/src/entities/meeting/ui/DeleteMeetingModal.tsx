import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';

import { DeleteMeetingModalProps } from '../types/DeleteMeetingModalProps';
import { deleteMeetingModalStyles } from './DeleteMeetingModal.styles';

const styles = deleteMeetingModalStyles();

export function DeleteMeetingModal(props: DeleteMeetingModalProps) {
  return (
    <Modal modalId={MODALS.DELETE_MEETING} onClose={props.onCancel}>
      <h2 class={styles.title()}>{i18n.t('meetings.delete.title')}</h2>
      <p class={styles.description()}>
        {i18n.t('meetings.delete.description')}
      </p>
      <div class={styles.footer()}>
        <Button variant="secondary" onClick={props.onCancel}>
          {i18n.t('meetings.delete.cancel')}
        </Button>
        <Button
          variant="danger"
          disabled={props.isDeleting}
          onClick={props.onConfirm}
        >
          {i18n.t('meetings.delete.confirm')}
        </Button>
      </div>
    </Modal>
  );
}
