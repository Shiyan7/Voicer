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
  const [activeSessionId, setActiveSessionId] = createSignal<string>();
  const [recordingHref, setRecordingHref] = createSignal('');
  let isRecordingOwned = false;

  const isSession = () => phase() !== 'prep';

  const isReview = () => phase() === 'review';

  const startRecording = async (sessionId: string) => {
    const recording = await ensureRecording();
    isRecordingOwned = recording.isOwned;
    await updateInterviewSession({
      id: sessionId,
      recordingStartedAt: new Date(recording.startedAt).toISOString(),
    });
  };

  const beginSession = (sessionId: string, initialTurns: LiveTurn[]) => {
    setActiveSessionId(sessionId);
    setPhase('session');
    session.start(sessionId, initialTurns);
    void startRecording(sessionId);
  };

  const startInterview = () => {
    const sessionId = prep.sessionId();
    if (sessionId) beginSession(sessionId, []);
  };

  const openPastSession = async (id: string) => {
    const pastSession = history.findSession(id);
    if (!pastSession) return;
    const savedTurns = (await fetchInterviewTurns(id)).map(toCompletedTurn);
    if (!pastSession.finishedAt) {
      beginSession(id, savedTurns);
      return;
    }
    const meetingId = pastSession.meetingId;
    setRecordingHref(meetingId ? paths.meeting(meetingId) : '');
    session.show(savedTurns);
    setPhase('review');
  };

  const finishInterview = async () => {
    session.stop();
    setPhase('prep');
    const sessionId = activeSessionId();
    if (isRecordingOwned) void stopRecording();
    isRecordingOwned = false;
    if (sessionId)
      await updateInterviewSession({ id: sessionId, finished: true });
    history.refetch();
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
