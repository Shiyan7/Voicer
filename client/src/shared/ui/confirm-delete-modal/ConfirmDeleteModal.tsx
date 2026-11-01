import { MODALS } from '@/shared/lib/modal';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';

import { confirmDeleteModalStyles } from './ConfirmDeleteModal.styles';

interface ConfirmDeleteModalProps {
  modalId: MODALS;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const styles = confirmDeleteModalStyles();

export function ConfirmDeleteModal(props: ConfirmDeleteModalProps) {
  return (
    <Modal modalId={props.modalId} onClose={props.onCancel}>
      <h2 class={styles.title()}>{props.title}</h2>
      <p class={styles.description()}>{props.description}</p>
      <div class={styles.footer()}>
        <Button variant="secondary" onClick={props.onCancel}>
          {props.cancelLabel}
        </Button>
        <Button
          variant="danger"
          disabled={props.isDeleting}
          onClick={props.onConfirm}
        >
          {props.confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
