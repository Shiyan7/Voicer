import { createSignal } from 'solid-js';

import { closeModal, MODALS, showModal } from '@/shared/lib/modal';

import { getThreadActions } from '../config/getThreadActions';
import { MAX_THREAD_TITLE_LENGTH } from '../config/MAX_THREAD_TITLE_LENGTH';
import { ThreadAction } from '../types/ThreadAction';
import { ThreadListDeps } from '../types/ThreadListDeps';

export const useThreadList = (deps: ThreadListDeps) => {
  const [renamingId, setRenamingId] = createSignal<string | null>(null);
  const [draft, setDraft] = createSignal('');

  const originalTitle = () =>
    deps.threads.find(({ id }) => id === renamingId())?.title ?? '';

  const canSave = () => {
    const title = draft().trim();
    return Boolean(title) && title !== originalTitle();
  };

  const counter = () => `${draft().length}/${MAX_THREAD_TITLE_LENGTH}`;

  const startRename = (id: string) => {
    setRenamingId(id);
    setDraft(originalTitle());
    showModal(MODALS.RENAME_CHAT_THREAD);
  };

  const cancelRename = () => {
    setRenamingId(null);
    closeModal(MODALS.RENAME_CHAT_THREAD);
  };

  const saveRename = () => {
    const id = renamingId();
    if (!id || !canSave()) return;
    deps.onRename(id, draft().trim());
    cancelRename();
  };

  const selectAction = (id: string, action: ThreadAction) => {
    if (action === 'rename') startRename(id);
    else deps.onDelete(id);
  };

  const focusInput = (element: HTMLInputElement) =>
    requestAnimationFrame(() => element.select());

  return {
    actions: getThreadActions,
    draft,
    setDraft,
    canSave,
    counter,
    saveRename,
    cancelRename,
    selectAction,
    focusInput,
  };
};
