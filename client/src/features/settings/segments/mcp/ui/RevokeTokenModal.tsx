import { i18n } from '@/shared/i18n';
import { closeModal, MODALS } from '@/shared/lib/modal';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';

import { RevokeTokenModalProps } from '../types/RevokeTokenModalProps';
import { revokeTokenModalStyles } from './RevokeTokenModal.styles';

const styles = revokeTokenModalStyles();

export function RevokeTokenModal(props: RevokeTokenModalProps) {
  const cancel = () => {
    closeModal(MODALS.REVOKE_API_TOKEN);
    props.onCancel();
  };

  return (
    <Modal modalId={MODALS.REVOKE_API_TOKEN} onClose={props.onCancel}>
      <h2 class={styles.title()}>{i18n.t('settings.mcp.revoke_title')}</h2>
      <p class={styles.description()}>
        {i18n.t('settings.mcp.revoke_description')}
      </p>
      <div class={styles.footer()}>
        <Button variant="secondary" onClick={cancel}>
          {i18n.t('settings.mcp.revoke_cancel')}
        </Button>
        <Button
          variant="danger"
          disabled={props.isRevoking}
          onClick={props.onConfirm}
        >
          {i18n.t('settings.mcp.revoke')}
        </Button>
      </div>
    </Modal>
  );
}
