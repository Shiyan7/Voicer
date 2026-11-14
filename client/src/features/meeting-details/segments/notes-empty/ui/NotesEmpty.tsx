import { i18n } from '@/shared/i18n';
import { EmptyState } from '@/shared/ui/empty-state';

export function NotesEmpty() {
  return (
    <EmptyState
      tone="ai"
      illustration="checklist"
      icon="common:sparkles"
      title={i18n.t('meetings.notes_empty.title')}
      description={i18n.t('meetings.notes_empty.description')}
      hint={i18n.t('meetings.notes_empty.hint')}
    />
  );
}
