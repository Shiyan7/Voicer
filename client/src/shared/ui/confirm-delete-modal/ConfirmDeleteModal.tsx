import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';

import { confirmDeleteModalStyles } from './ConfirmDeleteModal.styles';

export interface DeleteModalActions {
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

interface ConfirmDeleteModalProps extends DeleteModalActions {
  modalId: MODALS;
  title: string;
  description: string;
}

const styles = confirmDeleteModalStyles();

export function ConfirmDeleteModal(props: ConfirmDeleteModalProps) {
  return (
    <Modal modalId={props.modalId} onClose={props.onCancel}>
      <h2 class={styles.title()}>{props.title}</h2>
      <p class={styles.description()}>{props.description}</p>
      <div class={styles.footer()}>
        <Button variant="secondary" onClick={props.onCancel}>
          {i18n.t('delete_modal.cancel')}
        </Button>
        <Button
          variant="danger"
          disabled={props.isDeleting}
          onClick={props.onConfirm}
        >
          {i18n.t('delete_modal.confirm')}
        </Button>
      </div>
    </Modal>
  );
}
