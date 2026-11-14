import { settingsRoot } from '@/shared/roots/settingsRoot';
import { Tab } from '@/shared/ui/tabs';

import { SCREENSHOT_INTERVALS_SEC } from '../config/SCREENSHOT_INTERVALS_SEC';
import { toIntervalLabel } from '../lib/toIntervalLabel';

export const useRecording = () => {
  const autoRecord = () => settingsRoot.autoRecord;

  const toggleAutoRecord = () => {
    settingsRoot.toggleAutoRecord();
  };

  const screenshotIntervalTabs = (): Tab<number>[] =>
    SCREENSHOT_INTERVALS_SEC.map((seconds) => ({
      label: toIntervalLabel(seconds),
      value: seconds,
    }));

  const screenshotInterval = () => settingsRoot.screenshotIntervalSec;

  const selectScreenshotInterval = (seconds: number) => {
    settingsRoot.setScreenshotIntervalSec(seconds);
  };

  return {
    autoRecord,
    toggleAutoRecord,
    screenshotIntervalTabs,
    screenshotInterval,
    selectScreenshotInterval,
  };
};
