import { createEffect, on, onCleanup } from 'solid-js';

import { captureScreenshot } from '@/shared/lib/recorder';
import { settingsRoot } from '@/shared/roots/settingsRoot';

import { createFrameFingerprint } from '../lib/createFrameFingerprint';
import { isSameFrame } from '../lib/isSameFrame';
import { PendingScreenshot } from '../types/PendingScreenshot';
import { ScreenshotCaptureDeps } from '../types/ScreenshotCaptureDeps';

export const useScreenshotCapture = (deps: ScreenshotCaptureDeps) => {
  let pending: PendingScreenshot[] = [];
  let lastFingerprint: Uint8Array | null = null;

  const intervalMs = () =>
    deps.isCapturing() ? settingsRoot.screenshotIntervalSec * 1000 : 0;

  const capture = async () => {
    const offsetMs = Math.round(deps.elapsedMs());
    try {
      const image = await captureScreenshot();
      const fingerprint = await createFrameFingerprint(image);
      if (isSameFrame(lastFingerprint, fingerprint)) return;
      lastFingerprint = fingerprint;
      pending.push({ image, offsetMs });
    } catch (error) {
      console.error('[recorder] failed to capture screenshot:', error);
    }
  };

  createEffect(
    on(intervalMs, (ms) => {
      if (!ms) return;
      void capture();
      const id = setInterval(() => void capture(), ms);
      onCleanup(() => clearInterval(id));
    }),
  );

  const reset = () => {
    pending = [];
    lastFingerprint = null;
  };

  const takePending = () => {
    const screenshots = pending;
    reset();
    return screenshots;
  };

  return { reset, takePending };
};
