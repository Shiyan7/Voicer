import { ParentProps, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { VariantProps } from 'tailwind-variants';

import { closeModal, MODALS } from '@/shared/lib/modal';
import { Icon } from '@/shared/ui/icon';

import { useModal } from './hooks/useModal';
import { modalStyles } from './Modal.styles';

interface ModalProps extends ParentProps, VariantProps<typeof modalStyles> {
  modalId: MODALS;
  class?: string;
  overlayClass?: string;
  title?: string;
  hideClose?: boolean;
  onBack?: () => void;
  onClose?: () => void;
}

const styles = modalStyles();

export function Modal(props: ModalProps) {
  const modal = useModal(() => props.modalId);

  const handleClose = () => {
    if (!props.hideClose) {
      closeModal(props.modalId);
      props.onClose?.();
    }
  };

  return (
    <Show when={modal.mounted()}>
      <Portal mount={document.getElementById('modals')!}>
        <div class={styles.root()} onClick={handleClose}>
          <div
            class={styles.overlay({
              opened: modal.opened(),
              class: props.overlayClass,
            })}
          />
          <div
            class={styles.inner({
              class: props.class,
              size: props.size,
              opened: modal.opened(),
            })}
            onClick={(e) => e.stopPropagation()}
          >
            <Show when={!props.hideClose}>
              <button class={styles.close()} onClick={handleClose}>
                <Icon size={16} name="common:cross" />
              </button>
            </Show>
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
}
