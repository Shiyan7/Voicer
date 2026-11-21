import { i18n } from '@/shared/i18n';

import { ChatThreadSummary } from '../types/ChatThreadSummary';
import { ChatThreadView } from '../types/ChatThreadView';

export const toChatThreadView = (
  thread: ChatThreadSummary,
  activeId: string | undefined,
): ChatThreadView => ({
  id: thread.id,
  title: thread.title ?? i18n.t('chat.untitled'),
  isActive: thread.id === activeId,
});
