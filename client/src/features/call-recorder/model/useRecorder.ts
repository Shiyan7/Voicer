import { useNavigate } from '@solidjs/router';
import { onMount } from 'solid-js';

import { uploadMeetingAudioMutation } from '@/entities/meeting';
import { useElapsedTimer } from '@/shared/hooks/useElapsedTimer';
import {
  getRecorderState,
  onCallDetected,
  onCallEnded,
  onRecordingStarted,
  onRecordingStopped,
  startRecording,
  stopRecording,
} from '@/shared/lib/recorder';
import { formatSeconds } from '@/shared/lib/time';
import { settingsRoot } from '@/shared/roots/settingsRoot';
import { paths } from '@/shared/router';

import { readRecordingFile } from '../lib/readRecordingFile';

export const useRecorder = () => {
  const timer = useElapsedTimer();
  const navigate = useNavigate();
  const [, uploadAudio] = uploadMeetingAudioMutation();

  const isBarVisible = () => timer.isRunning();

  const formattedSeconds = () => formatSeconds(timer.elapsedSeconds());

  const openRecordedMeeting = async (path: string, startedAt: number) => {
    try {
      const file = await readRecordingFile(path, startedAt);
      const result = await uploadAudio({ file });
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
      timer.start(state.startedAt);
    }

    await onRecordingStarted((payload) => timer.start(payload.startedAt));

    await onRecordingStopped((payload) => {
      timer.stop();
      void openRecordedMeeting(payload.path, payload.startedAt);
    });

    await onCallDetected(() => void autoStart());

    await onCallEnded(() => void autoStop());
  };

  onMount(() => {
    void setup();
  });

  return {
    stop,
    isBarVisible,
    formattedSeconds,
  };
};
