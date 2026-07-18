import { useNavigate } from '@solidjs/router';
import { onMount } from 'solid-js';

import { useElapsedTimer } from '@/shared/hooks/useElapsedTimer';
import { formatSeconds } from '@/shared/lib/time';
import {
  getRecorderState,
  onRecordingStarted,
  onRecordingStopped,
  stopRecording,
  uploadRecording,
} from '@/shared/recorder';
import { paths } from '@/shared/router';

export const useRecorder = () => {
  const timer = useElapsedTimer();
  const navigate = useNavigate();

  const isBarVisible = () => timer.isRunning();

  const timeLabel = () => formatSeconds(timer.elapsedSeconds());

  const openRecordedMeeting = async (path: string, startedAt: number) => {
    try {
      const meetingId = await uploadRecording(path, startedAt);
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
  };

  onMount(() => {
    void setup();
  });

  return {
    isBarVisible,
    timeLabel,
    stop,
  };
};
