import { useNavigate } from '@solidjs/router';
import { createSignal, onMount } from 'solid-js';

import { uploadMeetingAudioMutation } from '@/entities/meeting';
import { useElapsedTimer } from '@/shared/hooks/useElapsedTimer';
import { i18n } from '@/shared/i18n';
import {
  getRecorderState,
  onCallDetected,
  onCallEnded,
  onRecordingLevel,
  onRecordingPauseChanged,
  onRecordingStarted,
  onRecordingStopped,
  pauseRecording,
  resumeRecording,
  startRecording,
  stopRecording,
} from '@/shared/lib/recorder';
import { formatClock } from '@/shared/lib/time';
import { settingsRoot } from '@/shared/roots/settingsRoot';
import { paths } from '@/shared/router';

import { readRecordingFile } from '../lib/readRecordingFile';
import { toVoiceLevel } from '../lib/toVoiceLevel';

export const useRecorder = () => {
  const timer = useElapsedTimer();
  const navigate = useNavigate();
  const [, uploadAudio] = uploadMeetingAudioMutation();

  const [level, setLevel] = createSignal(0);

  const isBarVisible = () => timer.isRunning();

  const isPaused = () => timer.isPaused();

  const pauseLabel = () =>
    isPaused() ? i18n.t('recorder.resume') : i18n.t('recorder.pause');

  const formattedSeconds = () => formatClock(timer.elapsedSeconds());

  const openRecordedMeeting = async (
    path: string,
    startedAt: number,
    source: string,
  ) => {
    try {
      const file = await readRecordingFile(path);
      const result = await uploadAudio({
        file,
        source: source,
        startedAt: new Date(startedAt).toISOString(),
      });
      const meetingId = result.data?.meetingUploadAudio.id;

      if (!meetingId) return;
      navigate(paths.meeting(meetingId));
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
      const state = isPaused()
        ? await resumeRecording()
        : await pauseRecording();
      timer.setPause(state.pausedMs, state.pausedAt);
    } catch (error) {
      console.error('[recorder] failed to toggle pause:', error);
    }
  };

  const autoStart = async () => {
    if (!settingsRoot.autoRecord) return;
    if (timer.isRunning()) return;
    try {
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

    if (state.state === 'recording') {
      timer.start(state.startedAt, state.pausedMs, state.pausedAt);
    }

    await onRecordingStarted((payload) => timer.start(payload.startedAt));

    await onRecordingPauseChanged((payload) =>
      timer.setPause(payload.pausedMs, payload.pausedAt),
    );

    await onRecordingLevel((rms) => setLevel(toVoiceLevel(rms)));

    await onRecordingStopped((payload) => {
      timer.stop();
      setLevel(0);
      void openRecordedMeeting(payload.path, payload.startedAt, payload.source);
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
