import { useNavigate } from '@solidjs/router';
import { createSignal, onMount } from 'solid-js';

import { uploadMeetingAudioMutation } from '@/entities/meeting';
import { useElapsedTimer } from '@/shared/hooks/useElapsedTimer';
import { i18n } from '@/shared/i18n';
import type { StopRecordingResult } from '@/shared/lib/recorder';
import {
  getRecorderState,
  onCallDetected,
  onCallEnded,
  onRecordingLevel,
  onRecordingPauseChanged,
  onRecordingStarted,
  onRecordingStopped,
  pauseRecording,
  readRecordingFile,
  resumeRecording,
  startRecording,
  stopRecording,
} from '@/shared/lib/recorder';
import { formatClock } from '@/shared/lib/time';
import { settingsRoot } from '@/shared/roots/settingsRoot';
import { paths } from '@/shared/router';

import { uploadMeetingScreenshots } from '../api/uploadMeetingScreenshots';
import { isCallRecording } from '../lib/isCallRecording';
import { toVoiceLevel } from '../lib/toVoiceLevel';
import { PendingScreenshot } from '../types/PendingScreenshot';
import { useScreenshotCapture } from './useScreenshotCapture';

export const useRecorder = () => {
  const timer = useElapsedTimer();
  const navigate = useNavigate();
  const [, uploadAudio] = uploadMeetingAudioMutation();

  const [level, setLevel] = createSignal(0);

  const isCapturing = () => timer.isRunning() && !timer.isPaused();

  const elapsedMs = () => timer.elapsedSeconds() * 1000;

  const screenshots = useScreenshotCapture({ isCapturing, elapsedMs });

  const isBarVisible = () => timer.isRunning();

  const isPaused = () => timer.isPaused();

  const pauseLabel = () =>
    isPaused() ? i18n.t('recorder.resume') : i18n.t('recorder.pause');

  const formattedSeconds = () => formatClock(timer.elapsedSeconds());

  const openRecordedMeeting = async (
    { path, startedAt, source }: StopRecordingResult,
    pendingScreenshots: PendingScreenshot[],
  ) => {
    try {
      const file = await readRecordingFile(path);
      const result = await uploadAudio({
        file,
        source: source,
        startedAt: new Date(startedAt).toISOString(),
      });
      const meeting = result.data?.meetingUploadAudio;
      if (!meeting) return;

      await uploadMeetingScreenshots(meeting.id, pendingScreenshots);
      navigate(paths.meeting(meeting.id));
    } catch (error) {
      console.error('[recorder] failed to upload recording:', error);
    }
  };

  const stop = async () => {
    try {
      await stopRecording();
    } catch (error) {
      console.error('[recorder] failed to stop recording:', error);
    }
  };

  const togglePause = async () => {
    try {
      if (isPaused()) await resumeRecording();
      else await pauseRecording();
    } catch (error) {
      console.error('[recorder] failed to toggle pause:', error);
    }
  };

  const autoStart = async () => {
    if (!settingsRoot.autoRecord) return;
    try {
      if ((await getRecorderState()).state === 'recording') return;
      const result = await startRecording();
      if (result.warnings.length) {
        console.warn('[recorder] auto-start warnings:', result.warnings);
      }
    } catch (error) {
      console.error('[recorder] failed to auto-start recording:', error);
    }
  };

  const autoStop = async () => {
    if (!settingsRoot.autoRecord) return;
    if (!timer.isRunning()) return;
    await stop();
  };

  const setup = async () => {
    const state = await getRecorderState();

    if (state.state === 'recording' && isCallRecording(state)) {
      timer.start(state.startedAt, state.pausedMs, state.pausedAt);
    }

    await onRecordingStarted((payload) => {
      if (!isCallRecording(payload)) return;
      screenshots.reset();
      timer.start(payload.startedAt);
    });

    await onRecordingPauseChanged((payload) => {
      if (isCallRecording(payload))
        timer.setPause(payload.pausedMs, payload.pausedAt);
    });

    await onRecordingLevel((payload) => {
      if (isCallRecording(payload)) setLevel(toVoiceLevel(payload.level));
    });

    await onRecordingStopped((payload) => {
      if (!isCallRecording(payload)) return;
      timer.stop();
      setLevel(0);
      void openRecordedMeeting(payload, screenshots.takePending());
    });

    await onCallDetected(() => void autoStart());

    await onCallEnded(() => void autoStop());
  };

  onMount(() => {
    void setup();
  });

  return {
    stop,
    togglePause,
    isBarVisible,
    isPaused,
    level,
    pauseLabel,
    formattedSeconds,
  };
};
