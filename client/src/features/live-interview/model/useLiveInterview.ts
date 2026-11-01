import { createSignal } from 'solid-js';

import { toInterviewSessionView } from '@/entities/interview-session';
import { uploadMeetingAudioMutation } from '@/entities/meeting';
import { readRecordingFile, stopRecording } from '@/shared/lib/recorder';

import { fetchInterviewTurns } from '../api/fetchInterviewTurns';
import { updateInterviewSession } from '../api/updateInterviewSession';
import { ensureRecording } from '../lib/ensureRecording';
import { toCompletedTurn } from '../lib/toCompletedTurn';
import { LivePhase } from '../types/LivePhase';
import { LiveTurn } from '../types/LiveTurn';
import { useLiveHistory } from './useLiveHistory';
import { useLivePrep } from './useLivePrep';
import { useLiveRecording } from './useLiveRecording';
import { useLiveSession } from './useLiveSession';

export function useLiveInterview() {
  const prep = useLivePrep();
  const session = useLiveSession();
  const history = useLiveHistory();
  const recording = useLiveRecording();
  const [phase, setPhase] = createSignal<LivePhase>('prep');
  const [reviewTitle, setReviewTitle] = createSignal('');
  const [, uploadAudio] = uploadMeetingAudioMutation();
  let activeSessionId: string | undefined;
  let isRecordingOwned = false;

  const isSession = () => phase() !== 'prep';

  const isReview = () => phase() === 'review';

  const startRecording = async () => {
    const { isOwned, startedAt } = await ensureRecording();
    isRecordingOwned = isOwned;
    session.startTimer(startedAt);
  };

  const beginSession = (sessionId: string, initialTurns: LiveTurn[]) => {
    activeSessionId = sessionId;
    setPhase('session');
    session.start(sessionId, initialTurns);
    void startRecording();
  };

  const startInterview = () => {
    const sessionId = prep.sessionId();
    if (sessionId) beginSession(sessionId, []);
  };

  const loadTurns = async (id: string) =>
    (await fetchInterviewTurns(id)).map(toCompletedTurn);

  const openPastSession = async (id: string) => {
    const pastSession = history.findSession(id);
    if (!pastSession) return;
    const savedTurns = await loadTurns(id);
    if (!pastSession.finishedAt) {
      beginSession(id, savedTurns);
      return;
    }
    const view = toInterviewSessionView(pastSession);
    setReviewTitle(`${view.dateLabel} · ${view.vacancyLabel}`);
    recording.show(pastSession.meetingId ?? '', pastSession.recordingUrl ?? '');
    session.show(savedTurns);
    setPhase('review');
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

  const finishSession = async (sessionId: string, isOwned: boolean) => {
    await Promise.all([
      updateInterviewSession({ id: sessionId, finished: true }),
      isOwned && saveRecording(sessionId),
    ]);
    history.refetch();
  };

  const finishInterview = async () => {
    const sessionId = activeSessionId;
    activeSessionId = undefined;
    const isOwned = isRecordingOwned;
    isRecordingOwned = false;
    session.stop();
    prep.reset();
    if (sessionId) await finishSession(sessionId, isOwned);
    setPhase('prep');
  };

  const closeReview = () => {
    recording.clear();
    setPhase('prep');
  };

  return {
    prep,
    session,
    history,
    isSession,
    isReview,
    reviewTitle,
    recording,
    startInterview,
    openPastSession,
    finishInterview,
    closeReview,
  };
}
