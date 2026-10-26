import { i18n } from '@/shared/i18n';

export const useSharedNotes = () => {
  const title = () => i18n.t('shared.title');

  const emptyTitle = () => i18n.t('shared.empty_title');

  const emptyHint = () => i18n.t('shared.empty_hint');

  return { title, emptyTitle, emptyHint };
};
