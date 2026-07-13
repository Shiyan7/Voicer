import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { StatusBadge } from '@/shared/ui/status-badge';
import { useViewModel } from '@/shared/view-model';

import { DetailsHeaderViewModel } from '../model/DetailsHeaderViewModel';
import { DetailsHeaderDeps } from '../types/DetailsHeaderDeps';
import { detailsHeaderStyles } from './DetailsHeader.styles';

const styles = detailsHeaderStyles();

export function DetailsHeader(props: DetailsHeaderDeps) {
  const vm = useViewModel(DetailsHeaderViewModel, () => props);

  return (
    <>
      <header class={styles.header()}>
        <div class={styles.titleRow()}>
          <Show
            when={vm.isEditingTitle}
            fallback={
              <h1
                class={styles.title()}
                title={i18n.t('meetings.rename')}
                onClick={vm.startTitleEdit}
              >
                {vm.title}
              </h1>
            }
          >
            <input
              class={styles.titleInput()}
              ref={(el) => queueMicrotask(() => el.focus())}
              value={vm.titleDraft}
              onBlur={vm.commitTitle}
              onInput={vm.onTitleInput}
              onKeyDown={vm.onTitleKeyDown}
            />
          </Show>
          <Button
            class={styles.deleteBtn()}
            variant="ghost"
            onClick={vm.requestDelete}
          >
            {i18n.t('meetings.delete')}
          </Button>
        </div>
        <div class={styles.metaRow()}>
          <span>{vm.metaLabel}</span>
          <StatusBadge status={vm.status} />
        </div>
      </header>

      <Modal class="p-6 sm:max-w-sm" modalId={MODALS.DELETE_MEETING}>
        <h3 class={styles.modalTitle()}>{i18n.t('meetings.delete')}</h3>
        <p class={styles.modalText()}>{i18n.t('meetings.delete_confirm')}</p>
        <div class={styles.modalActions()}>
          <Button variant="secondary" onClick={vm.cancelDelete}>
            {i18n.t('meetings.cancel')}
          </Button>
          <Button disabled={vm.isDeleting} onClick={vm.confirmDelete}>
            {i18n.t('meetings.delete')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
