import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';

import { MAX_THREAD_TITLE_LENGTH } from '../config/MAX_THREAD_TITLE_LENGTH';
import { RenameThreadModalProps } from '../types/RenameThreadModalProps';
import { renameThreadModalStyles } from './RenameThreadModal.styles';

const styles = renameThreadModalStyles();

export function RenameThreadModal(props: RenameThreadModalProps) {
  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    props.onSave();
  };

  return (
    <Modal modalId={MODALS.RENAME_CHAT_THREAD} onClose={props.onCancel}>
      <h2 class={styles.title()}>{i18n.t('chat.rename_title')}</h2>
      <form class={styles.form()} onSubmit={submit}>
        <Input
          ref={props.inputRef}
          value={props.draft}
          maxLength={MAX_THREAD_TITLE_LENGTH}
          aria-label={i18n.t('chat.rename_title')}
          onInput={(event) => props.onDraft(event.currentTarget.value)}
        />
        <span class={styles.counter()}>{props.counter}</span>
        <div class={styles.footer()}>
          <Button variant="secondary" type="button" onClick={props.onCancel}>
            {i18n.t('chat.rename_cancel')}
          </Button>
          <Button type="submit" disabled={!props.canSave}>
            {i18n.t('chat.rename_save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
