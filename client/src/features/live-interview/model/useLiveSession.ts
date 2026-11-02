import { createMemo, createSignal, mapArray, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';

import { useElapsedTimer } from '@/shared/hooks/useElapsedTimer';
import { i18n } from '@/shared/i18n';
import { formatClock } from '@/shared/lib/time';

import { createServerLiveSource } from '../api/createServerLiveSource';
import { EMPTY_TURN } from '../config/liveInterviewConfig';
import { toLiveTurnView } from '../lib/toLiveTurnView';
import { LiveSourceHandlers } from '../types/LiveSourceHandlers';
import { LiveStatus } from '../types/LiveStatus';
import { LiveTurn } from '../types/LiveTurn';

export function useLiveSession() {
  const [turns, setTurns] = createStore<LiveTurn[]>([]);
  const [status, setStatus] = createSignal<LiveStatus>('idle');
  const [expanded, setExpanded] = createSignal(new Set<string>());
  const timer = useElapsedTimer();
  let source: ReturnType<typeof createServerLiveSource> | undefined;

  const applyTurn: LiveSourceHandlers['onTurn'] = (patch) => {
    const index = turns.findIndex((turn) => turn.id === patch.id);
    if (index < 0) setTurns(turns.length, { ...EMPTY_TURN, ...patch });
    else setTurns(index, patch);
  };

  const stop = () => {
    source?.stop();
    source = undefined;
    timer.stop();
  };

  const show = (savedTurns: LiveTurn[]) => {
    stop();
    setTurns(savedTurns);
    setExpanded(new Set<string>());
  };

  const start = (sessionId: string, initialTurns: LiveTurn[]) => {
    show(initialTurns);
    source = createServerLiveSource(sessionId, {
      onTurn: applyTurn,
      onStatus: setStatus,
    });
    source.start();
  };

  const startTimer = (startedAt: number) => timer.start(startedAt);

  const timerLabel = () => formatClock(timer.elapsedSeconds());

  const statusLabel = () => i18n.t(`live.session.status.${status()}`);

  const isAnswering = () => status() === 'answering';

  const turnViews = mapArray(
    () => turns,
    (turn) => createMemo(() => toLiveTurnView(turn, expanded().has(turn.id))),
  );

  const isEmpty = () => turns.length === 0;

  const toggleDetails = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const answerNow = () => source?.requestAnswer();

  const captureCode = () => void source?.captureCode();

  onCleanup(stop);

  return {
    start,
    stop,
    show,
    startTimer,
    timerLabel,
    statusLabel,
    isAnswering,
    turnViews,
    isEmpty,
    toggleDetails,
    answerNow,
    captureCode,
  };
}
