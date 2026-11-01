import { createSignal } from 'solid-js';

import { LivePhase } from '../types/LivePhase';
import { useLivePrep } from './useLivePrep';
import { useLiveSession } from './useLiveSession';

export function useLiveInterview() {
  const prep = useLivePrep();
  const session = useLiveSession();
  const [phase, setPhase] = createSignal<LivePhase>('prep');

  const isSession = () => phase() === 'session';

  const startInterview = () => {
    const sessionId = prep.sessionId();
    if (!sessionId) return;
    setPhase('session');
    session.start(sessionId);
  };

  const finishInterview = () => {
    session.stop();
    setPhase('prep');
  };

  return { prep, session, isSession, startInterview, finishInterview };
}
