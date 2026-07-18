import { isTauri } from '@tauri-apps/api/core';
import { type UnlistenFn } from '@tauri-apps/api/event';
import { createSignal, onCleanup, onMount } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { formatSeconds } from '@/shared/lib/time';
import {
  getRecorderState,
  onRecordingStarted,
  onRecordingStopped,
  stopRecording,
  uploadRecording,
} from '@/shared/recorder';

export const useRecorder = () => {
  const [startedAt, setStartedAt] = createSignal<number | null>(null);
  const [now, setNow] = createSignal(Date.now());
  const [uploading, setUploading] = createSignal(false);

  let timer: ReturnType<typeof setInterval> | undefined;
  const unlisteners: UnlistenFn[] = [];

  const isRecording = () => startedAt() !== null;

  const isUploading = () => uploading();

  const isBarVisible = () => isRecording() || isUploading();

  const barText = () =>
    isUploading() ? i18n.t('recorder.uploading') : i18n.t('recorder.recording');

  const elapsedSeconds = () => {
    const start = startedAt();
    return start === null ? 0 : Math.max(0, (now() - start) / 1000);
  };

  const timeLabel = () => formatSeconds(elapsedSeconds());

  const startTicking = () => {
    setNow(Date.now());
    timer ??= setInterval(() => setNow(Date.now()), 500);
  };

  const stopTicking = () => {
    if (timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };

  const begin = (startedAtMs: number) => {
    setStartedAt(startedAtMs);
    startTicking();
  };

  const end = () => {
    setStartedAt(null);
    stopTicking();
  };

  const startUpload = async (path: string, startedAtMs: number) => {
    setUploading(true);
    try {
      await uploadRecording(path, startedAtMs);
    } catch (error) {
      console.error('[recorder] failed to upload recording:', error);
    } finally {
      setUploading(false);
    }
  };

  const stop = async () => {
    try {
      await stopRecording();
    } catch (error) {
      console.error('[recorder] failed to stop recording:', error);
    }
  };

  const setup = async () => {
    if (!isTauri()) return;

    const state = await getRecorderState().catch(() => null);
    if (state?.state === 'recording') {
      begin(state.startedAt);
    }

    unlisteners.push(
      await onRecordingStarted((payload) => begin(payload.startedAt)),
    );
    unlisteners.push(
      await onRecordingStopped((payload) => {
        end();
        void startUpload(payload.path, payload.startedAt);
      }),
    );
  };

  onMount(() => {
    void setup();
  });

  onCleanup(() => {
    stopTicking();
    unlisteners.forEach((unlisten) => unlisten());
  });

  return {
    isBarVisible,
    isUploading,
    barText,
    timeLabel,
    stop,
  };
};
