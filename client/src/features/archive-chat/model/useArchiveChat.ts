import { useNavigate, useParams } from '@solidjs/router';

import { useToasts } from '@/entities/toasts';
import { useDeleteConfirmation } from '@/shared/hooks/useDeleteConfirmation';
import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';
import { paths } from '@/shared/router';

import { chatThreadsQuery } from '../api/chatThreadsQuery';
import { createChatThreadMutation } from '../api/createChatThreadMutation';
import { deleteChatThreadMutation } from '../api/deleteChatThreadMutation';
import { renameChatThreadMutation } from '../api/renameChatThreadMutation';
import { toChatThreadView } from '../lib/toChatThreadView';

export const useArchiveChat = () => {
  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const toasts = useToasts();
  const [threadsResult, refetchThreads] = chatThreadsQuery();
  const [, createThreadMutation] = createChatThreadMutation();
  const [deleteState, deleteThreadMutation] = deleteChatThreadMutation();
  const [, renameThreadMutation] = renameChatThreadMutation();

  const threadId = () => params.id;

  const threads = () =>
    (threadsResult.data?.chatThreads ?? []).map((thread) =>
      toChatThreadView(thread, threadId()),
    );

  const isThreadsLoading = () => threadsResult.fetching && !threadsResult.data;

  const refreshThreads = () =>
    refetchThreads({ requestPolicy: 'network-only' });

  const createThread = async () => {
    const response = await createThreadMutation({});
    const id = response.data?.createChatThread.id;
    if (!id) {
      toasts.show('error', i18n.t('chat.create_error'));
      return undefined;
    }
    navigate(paths.chatThread(id));
    refreshThreads();
    return id;
  };

  const startNewChat = () => navigate(paths.chat);

  const renameThread = async (id: string, title: string) => {
    const response = await renameThreadMutation({ threadId: id, title });
    if (response.error) toasts.show('error', i18n.t('chat.rename_error'));
  };

  const removeThread = async (id: string) => {
    const response = await deleteThreadMutation({ threadId: id });
    if (!response.error && id === threadId()) {
      navigate(paths.chat, { replace: true });
    }
    return response;
  };

  const deletion = useDeleteConfirmation({
    modalId: MODALS.DELETE_CHAT_THREAD,
    remove: removeThread,
    onSuccess: refreshThreads,
    onError: () => toasts.show('error', i18n.t('chat.delete_error')),
  });

  const isDeleting = () => deleteState.fetching;

  return {
    threadId,
    threads,
    isThreadsLoading,
    createThread,
    startNewChat,
    renameThread,
    refreshThreads,
    requestDelete: deletion.request,
    confirmDelete: deletion.confirm,
    cancelDelete: deletion.cancel,
    isDeleting,
  };
};
