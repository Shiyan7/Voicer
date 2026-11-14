import { i18n } from '@/shared/i18n';

export const toEmptyHint = (intervalSec: number) =>
  intervalSec
    ? i18n.t('meetings.screenshots_empty.hint_on', {
        seconds: String(intervalSec),
      })
    : i18n.t('meetings.screenshots_empty.hint_off');
