import { makePersisted } from '@solid-primitives/storage';
import { createRoot, createSignal } from 'solid-js';

import { DEFAULT_SCREENSHOT_INTERVAL_SEC } from '../config/DEFAULT_SCREENSHOT_INTERVAL_SEC';
import { storage } from '../storage';

export const settingsRoot = createRoot(() => {
  const [autoRecord, setAutoRecord] = makePersisted(createSignal(true), {
    name: 'settings.autoRecord',
    storage,
    serialize: (value: boolean) => (value ? '1' : '0'),
    deserialize: (raw) => raw === '1',
  });

  const [screenshotIntervalSec, setScreenshotIntervalSec] = makePersisted(
    createSignal(DEFAULT_SCREENSHOT_INTERVAL_SEC),
    {
      name: 'settings.screenshotIntervalSec',
      storage,
      serialize: (value: number) => String(value),
      deserialize: (raw) => Number(raw) || 0,
    },
  );

  return {
    get screenshotIntervalSec() {
      return screenshotIntervalSec();
    },
    setScreenshotIntervalSec(seconds: number) {
      setScreenshotIntervalSec(seconds);
    },
    get autoRecord() {
      return autoRecord();
    },
    toggleAutoRecord() {
      setAutoRecord((value) => !value);
    },
  };
});
