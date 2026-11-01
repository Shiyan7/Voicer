import { createSignal, onCleanup } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { i18n } from '@/shared/i18n';

import { createServerLiveSource } from '../api/createServerLiveSource';
import { TIMER_INTERVAL_MS } from '../config/liveInterviewConfig';
import { formatElapsed } from '../lib/formatElapsed';
import { toLiveTurnView } from '../lib/toLiveTurnView';
import { LiveAnswerUpdate } from '../types/LiveAnswerUpdate';
import { LiveSource } from '../types/LiveSource';
import { LiveStatus } from '../types/LiveStatus';
import { LiveTranscriptEvent } from '../types/LiveTranscriptEvent';
import { LiveTurn } from '../types/LiveTurn';

const createTurn = (event: LiveTranscriptEvent): LiveTurn => ({
  id: event.turnId,
  question: event.text,
  isQuestionFinal: event.isFinal,
  short: '',
  details: '',
  code: '',
  codeLanguage: '',
  isDone: false,
});

export function useLiveSession() {
  const [turns, setTurns] = createStore<LiveTurn[]>([]);
  const [status, setStatus] = createSignal<LiveStatus>('idle');
  const [elapsed, setElapsed] = createSignal(0);
  const [expanded, setExpanded] = createSignal<Set<string>>(new Set());
  let timer: ReturnType<typeof setInterval> | undefined;
  let source: LiveSource | undefined;
  let unsubscribers: (() => void)[] = [];

  const applyTranscript = (event: LiveTranscriptEvent) =>
    setTurns(
      produce((list) => {
        const turn = list.find((item) => item.id === event.turnId);
        if (!turn) {
          list.push(createTurn(event));
          return;
        }
        turn.question = event.text;
        turn.isQuestionFinal = event.isFinal;
      }),
    );

  const applyAnswer = (update: LiveAnswerUpdate) =>
    setTurns(
      produce((list) => {
        const turn = list.find((item) => item.id === update.turnId);
        if (!turn) return;
        turn.short = update.short;
        turn.details = update.details;
        turn.code = update.code;
        turn.codeLanguage = update.codeLanguage;
        turn.isDone = update.isDone;
      }),
    );

  const detachSource = () => {
    source?.stop();
    unsubscribers.forEach((unsubscribe) => unsubscribe());
    unsubscribers = [];
    source = undefined;
  };

  const attachSource = (sessionId: string) => {
    const next = createServerLiveSource(sessionId);
    unsubscribers = [
      next.onTranscript(applyTranscript),
      next.onAnswer(applyAnswer),
      next.onStatus(setStatus),
    ];
    source = next;
    return next;
  };

  const stopTimer = () => clearInterval(timer);

  const start = (sessionId: string, initialTurns: LiveTurn[]) => {
    detachSource();
    setTurns(initialTurns);
    setElapsed(0);
    stopTimer();
    timer = setInterval(
      () => setElapsed((value) => value + 1),
      TIMER_INTERVAL_MS,
    );
    attachSource(sessionId).start();
  };

  const stop = () => {
    stopTimer();
    detachSource();
  };

  const show = (savedTurns: LiveTurn[]) => {
    stop();
    setTurns(savedTurns);
  };

  const timerLabel = () => formatElapsed(elapsed());

  const statusLabel = () => i18n.t(`live.session.status.${status()}`);

  const isAnswering = () => status() === 'answering';

  const turnViews = () =>
    turns.map((turn) => toLiveTurnView(turn, expanded().has(turn.id)));

  const isEmpty = () => turns.length === 0;

  const toggleDetails = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const answerNow = () => source?.requestAnswer();

  const captureCode = () => source?.captureCode();

  onCleanup(stop);

  return {
    start,
    stop,
    show,
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
