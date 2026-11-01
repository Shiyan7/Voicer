import { useNavigate, useParams } from '@solidjs/router';
import { createEffect, createSignal, on } from 'solid-js';

import { getInterviewSessionTitle } from '@/entities/interview-session';
import { uploadMeetingAudioMutation } from '@/entities/meeting';
import { readRecordingFile, stopRecording } from '@/shared/lib/recorder';
import { paths } from '@/shared/router';

import { fetchInterviewSession } from '../api/fetchInterviewSession';
import { fetchInterviewTurns } from '../api/fetchInterviewTurns';
import { updateInterviewSession } from '../api/updateInterviewSession';
import { ensureRecording } from '../lib/ensureRecording';
import { toCompletedTurn } from '../lib/toCompletedTurn';
import { LiveSessionDetails } from '../types/LiveSessionDetails';
import { LiveTurn } from '../types/LiveTurn';
import { useLiveRecording } from './useLiveRecording';
import { useLiveSession } from './useLiveSession';

export function useLiveInterview() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const session = useLiveSession();
  const recording = useLiveRecording();
  const [details, setDetails] = createSignal<LiveSessionDetails>();
  const [, uploadAudio] = uploadMeetingAudioMutation();
  let activeSessionId: string | undefined;
  let isRecordingOwned = false;

  const isLoaded = () => !!details();

  const isReview = () => !!details()?.finishedAt;

  const reviewTitle = () => {
    const current = details();
    return current ? getInterviewSessionTitle(current) : '';
  };

  const startRecording = async () => {
    const { isOwned, startedAt } = await ensureRecording();
    isRecordingOwned = isOwned;
    session.startTimer(startedAt);
  };

  const beginSession = (sessionId: string, initialTurns: LiveTurn[]) => {
    activeSessionId = sessionId;
    session.start(sessionId, initialTurns);
    void startRecording();
  };

  const showReview = (found: LiveSessionDetails, savedTurns: LiveTurn[]) => {
    recording.show(found.meetingId ?? '', found.recordingUrl ?? '');
    session.show(savedTurns);
  };

  const open = async (id: string) => {
    const [found, turns] = await Promise.all([
      fetchInterviewSession(id),
      fetchInterviewTurns(id),
    ]);
    if (!found) {
      navigate(paths.live, { replace: true });
      return;
    }
    const savedTurns = turns.map(toCompletedTurn);
    setDetails(found);
    if (found.finishedAt) showReview(found, savedTurns);
    else beginSession(id, savedTurns);
  };

  const saveRecording = async (interviewSessionId: string) => {
    try {
      const { path, startedAt, source } = await stopRecording();
      await uploadAudio({
        file: await readRecordingFile(path),
        source,
        startedAt: new Date(startedAt).toISOString(),
        interviewSessionId,
      });
    } catch (error) {
      console.error('[live-interview] failed to save recording:', error);
    }
  };

  const finishInterview = async () => {
    const sessionId = activeSessionId;
    const isOwned = isRecordingOwned;
    activeSessionId = undefined;
    isRecordingOwned = false;
    session.stop();
    if (!sessionId) {
      navigate(paths.live);
      return;
    }
    await Promise.all([
      updateInterviewSession({ id: sessionId, finished: true }),
      isOwned && saveRecording(sessionId),
    ]);
    await open(sessionId);
  };

  const closeReview = () => navigate(paths.live);

  createEffect(
    on(
      () => params.id,
      (id) => void open(id),
    ),
  );

  return {
    session,
    isLoaded,
    isReview,
    reviewTitle,
    recording,
    finishInterview,
    closeReview,
  };
}
