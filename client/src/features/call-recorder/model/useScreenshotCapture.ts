import { createEffect, on, onCleanup } from 'solid-js';

import { captureScreenshot } from '@/shared/lib/recorder';
import { settingsRoot } from '@/shared/roots/settingsRoot';

import { addMeetingScreenshot } from '../api/addMeetingScreenshot';
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

  const takePending = () => {
    const screenshots = pending;
    pending = [];
    lastFingerprint = null;
    return screenshots;
  };

  const upload = async (
    meetingId: string,
    screenshots: PendingScreenshot[],
  ) => {
    for (const { image, offsetMs } of screenshots) {
      try {
        await addMeetingScreenshot({ meetingId, image, offsetMs });
      } catch (error) {
        console.error('[recorder] failed to upload screenshot:', error);
      }
    }
  };

  return { takePending, upload };
};
