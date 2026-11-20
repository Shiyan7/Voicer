import type { ChatThreadOutput } from '@schema';

import { i18n } from '@/shared/i18n';

import { ChatThreadView } from '../types/ChatThreadView';

export const toChatThreadView = (
  thread: Pick<ChatThreadOutput, 'id' | 'title'>,
  activeId: string | undefined,
): ChatThreadView => ({
  id: thread.id,
  title: thread.title ?? i18n.t('chat.untitled'),
  isActive: thread.id === activeId,
});
