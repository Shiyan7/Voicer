import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';
import { ConfirmDeleteModal } from '@/shared/ui/confirm-delete-modal';

import { archiveChatStyles } from './ArchiveChat.styles';
import { useArchiveChat } from './model/useArchiveChat';
import { Conversation } from './segments/conversation';
import { ThreadList } from './segments/thread-list';

const styles = archiveChatStyles();

export function ArchiveChatOrchestrator() {
  const vm = useArchiveChat();

  return (
    <div class={styles.root()}>
      <ConfirmDeleteModal
        modalId={MODALS.DELETE_CHAT_THREAD}
        title={i18n.t('chat.delete_title')}
        description={i18n.t('chat.delete_description')}
        isDeleting={vm.isDeleting()}
        onConfirm={vm.confirmDelete}
        onCancel={vm.cancelDelete}
      />
      <ThreadList
        threads={vm.threads()}
        isLoading={vm.isThreadsLoading()}
        onNew={vm.startNewChat}
        onRename={vm.renameThread}
        onDelete={vm.requestDelete}
      />
      <Conversation
        threadId={vm.threadId}
        createThread={vm.createThread}
        onAsked={vm.refreshThreads}
      />
    </div>
  );
}
