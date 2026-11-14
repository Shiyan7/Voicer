import { i18n } from '@/shared/i18n';
import { EmptyState } from '@/shared/ui/empty-state';

import { ScreenshotsEmptyProps } from '../types/ScreenshotsEmptyProps';

export function ScreenshotsEmpty(props: ScreenshotsEmptyProps) {
  return (
    <EmptyState
      tone="info"
      illustration="windows"
      icon="common:clock"
      title={i18n.t('meetings.screenshots_empty.title')}
      description={i18n.t('meetings.screenshots_empty.description')}
      hint={props.hint}
    />
  );
}
