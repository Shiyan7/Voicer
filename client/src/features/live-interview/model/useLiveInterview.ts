import { createSignal } from 'solid-js';

import { stopRecording } from '@/shared/lib/recorder';
import { paths } from '@/shared/router';

import { fetchInterviewTurns } from '../api/fetchInterviewTurns';
import { updateInterviewSession } from '../api/updateInterviewSession';
import { ensureRecording } from '../lib/ensureRecording';
import { toCompletedTurn } from '../lib/toCompletedTurn';
import { LivePhase } from '../types/LivePhase';
import { LiveTurn } from '../types/LiveTurn';
import { useLiveHistory } from './useLiveHistory';
import { useLivePrep } from './useLivePrep';
import { useLiveSession } from './useLiveSession';

export function useLiveInterview() {
  const prep = useLivePrep();
  const session = useLiveSession();
  const history = useLiveHistory();
  const [phase, setPhase] = createSignal<LivePhase>('prep');
  const [recordingHref, setRecordingHref] = createSignal('');
  let activeSessionId: string | undefined;
  let isRecordingOwned = false;

  const isSession = () => phase() !== 'prep';

  const isReview = () => phase() === 'review';

  const startRecording = async () => {
    const recording = await ensureRecording();
    isRecordingOwned = recording.isOwned;
    session.startTimer(recording.startedAt);
  };

  const beginSession = (sessionId: string, initialTurns: LiveTurn[]) => {
    activeSessionId = sessionId;
    setPhase('session');
    session.start(sessionId, initialTurns);
    startRecording().catch(session.fail);
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
    const savedTurns = await loadTurns(id).catch(prep.fail);
    if (!savedTurns) return;
    if (!pastSession.finishedAt) {
      beginSession(id, savedTurns);
      return;
    }
    const meetingId = pastSession.meetingId;
    setRecordingHref(meetingId ? paths.meeting(meetingId) : '');
    session.show(savedTurns);
    setPhase('review');
  };

  const finishSession = async (sessionId: string) => {
    await updateInterviewSession({ id: sessionId, finished: true });
    await history.refetch();
  };

  const finishInterview = async () => {
    const sessionId = activeSessionId;
    activeSessionId = undefined;
    session.stop();
    if (isRecordingOwned) void stopRecording().catch(prep.fail);
    isRecordingOwned = false;
    prep.reset();
    if (sessionId) await finishSession(sessionId).catch(prep.fail);
    setPhase('prep');
  };

  const closeReview = () => setPhase('prep');

  return {
    prep,
    session,
    history,
    isSession,
    isReview,
    recordingHref,
    startInterview,
    openPastSession,
    finishInterview,
    closeReview,
  };
}
