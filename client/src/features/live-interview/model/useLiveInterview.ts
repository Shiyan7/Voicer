import { useNavigate, useParams } from '@solidjs/router';
import { createEffect, createSignal, on } from 'solid-js';

import { getInterviewSessionTitle } from '@/entities/interview-session';
import { uploadMeetingAudioMutation } from '@/entities/meeting';
import { i18n } from '@/shared/i18n';
import { readRecordingFile, stopRecording } from '@/shared/lib/recorder';
import { paths } from '@/shared/router';

import { fetchInterviewSession } from '../api/fetchInterviewSession';
import { fetchInterviewTurns } from '../api/fetchInterviewTurns';
import { finishInterviewSession } from '../api/finishInterviewSession';
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

  const sessionId = () => params.id;

  const isLoaded = () => !!details();

  const isReview = () => !!details()?.finishedAt;

  const reviewTitle = () => {
    const current = details();
    return current ? getInterviewSessionTitle(current) : '';
  };

  const emptyLabel = () =>
    isReview()
      ? i18n.t('live.session.no_turns')
      : i18n.t('live.session.waiting');

  const startRecording = async () => {
    const { isOwned, startedAt } = await ensureRecording();
    isRecordingOwned = isOwned;
    session.startTimer(startedAt);
  };

  const beginSession = (id: string, initialTurns: LiveTurn[]) => {
    activeSessionId = id;
    session.start(id, initialTurns);
    void startRecording();
  };

  const showReview = (found: LiveSessionDetails, savedTurns: LiveTurn[]) => {
    recording.show(found.meetingId ?? '', found.recordingUrl ?? null);
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
    const finishingId = activeSessionId;
    const isOwned = isRecordingOwned;
    activeSessionId = undefined;
    isRecordingOwned = false;
    session.stop();
    if (!finishingId) {
      navigate(paths.live);
      return;
    }
    await Promise.all([
      finishInterviewSession({ id: finishingId }),
      isOwned ? saveRecording(finishingId) : Promise.resolve(),
    ]);
    await open(finishingId);
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
    sessionId,
    isLoaded,
    isReview,
    reviewTitle,
    emptyLabel,
    recording,
    finishInterview,
    closeReview,
  };
}
