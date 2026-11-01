import { createSignal } from 'solid-js';

import { closeModal, MODALS, showModal } from '@/shared/lib/modal';

interface DeleteConfirmationOptions {
  modalId: MODALS;
  remove: (id: string) => Promise<{ error?: unknown }>;
  onSuccess: () => void;
  onError: () => void;
}

export const useDeleteConfirmation = (options: DeleteConfirmationOptions) => {
  const [pendingId, setPendingId] = createSignal<string | null>(null);

  const request = (id: string) => {
    setPendingId(id);
    showModal(options.modalId);
  };

  const cancel = () => {
    setPendingId(null);
    closeModal(options.modalId);
  };

  const confirm = async () => {
    const id = pendingId();
    if (!id) return;

    const result = await options.remove(id);
    if (result.error) {
      options.onError();
      return;
    }

    cancel();
    options.onSuccess();
  };

  return { request, confirm, cancel };
};
