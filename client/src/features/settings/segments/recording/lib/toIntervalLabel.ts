import { i18n } from '@/shared/i18n';

export const toIntervalLabel = (seconds: number) =>
  seconds
    ? i18n.t('settings.recording.screenshots_every', { seconds: String(seconds) })
    : i18n.t('settings.recording.screenshots_off');
