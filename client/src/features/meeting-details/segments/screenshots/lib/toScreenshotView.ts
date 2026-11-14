import type { MeetingScreenshotOutput } from '@schema';

import { i18n } from '@/shared/i18n';
import { formatClockMs } from '@/shared/lib/time';

import { ScreenshotView } from '../types/ScreenshotView';

export const toScreenshotView = (
  screenshot: MeetingScreenshotOutput,
): ScreenshotView => {
  const timeLabel = formatClockMs(screenshot.offsetMs);
  return {
    id: screenshot.id,
    url: screenshot.url,
    thumbUrl: screenshot.thumbUrl,
    offsetMs: screenshot.offsetMs,
    timeLabel,
    alt: i18n.t('meetings.screenshot_alt', { time: timeLabel }),
  };
};
