import {
  ANSWER_CHUNK_INTERVAL_MS,
  ANSWER_CHUNK_SIZE,
  LIVE_SCENARIO,
  PAUSE_BEFORE_ANSWER_MS,
  PAUSE_BETWEEN_TURNS_MS,
  WORD_INTERVAL_MS,
} from '../config/liveInterviewConfig';
import { chunkText } from '../lib/chunkText';
import { createEmitter } from '../lib/createEmitter';
import { splitWords } from '../lib/splitWords';
import { LiveAnswerContent } from '../types/LiveAnswerContent';
import { LiveAnswerUpdate } from '../types/LiveAnswerUpdate';
import { LiveScenarioStep } from '../types/LiveScenarioStep';
import { LiveSource } from '../types/LiveSource';
import { LiveStatus } from '../types/LiveStatus';
import { LiveTranscriptEvent } from '../types/LiveTranscriptEvent';

export const createMockLiveSource = (): LiveSource => {
  const transcript = createEmitter<LiveTranscriptEvent>();
  const answer = createEmitter<LiveAnswerUpdate>();
  const status = createEmitter<LiveStatus>();
  const timers = new Set<ReturnType<typeof setTimeout>>();
  let stepIndex = 0;
  let turnCount = 0;
  let pendingAnswer: (() => void) | undefined;

  const clearTimers = () => {
    timers.forEach(clearTimeout);
    timers.clear();
  };

  const schedule = (fn: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timers.delete(timer);
      fn();
    }, delay);
    timers.add(timer);
  };

  const streamAnswer = (turnId: string, step: LiveScenarioStep) => {
    const parts: [keyof LiveAnswerContent, string[]][] = [
      ['short', chunkText(step.short, ANSWER_CHUNK_SIZE)],
      ['details', chunkText(step.details, ANSWER_CHUNK_SIZE)],
      ['code', chunkText(step.code?.text ?? '', ANSWER_CHUNK_SIZE * 3)],
    ];
    const content: LiveAnswerContent = {
      short: '',
      details: '',
      code: '',
      codeLanguage: step.code?.language ?? '',
    };
    const snapshots = parts.flatMap(([part, deltas]) =>
      deltas.map((delta) => {
        content[part] += delta;
        return { ...content };
      }),
    );

    status.emit('answering');
    snapshots.forEach((snapshot, index) =>
      schedule(
        () => answer.emit({ ...snapshot, turnId, isDone: false }),
        index * ANSWER_CHUNK_INTERVAL_MS,
      ),
    );
    schedule(() => {
      answer.emit({ ...content, turnId, isDone: true });
      status.emit('listening');
      scheduleNext();
    }, snapshots.length * ANSWER_CHUNK_INTERVAL_MS);
  };

  const playStep = (step: LiveScenarioStep) => {
    turnCount += 1;
    const turnId = `turn-${turnCount}`;
    const words = splitWords(step.question);

    const finishQuestion = () => {
      pendingAnswer = undefined;
      clearTimers();
      transcript.emit({ turnId, text: step.question, isFinal: true });
      schedule(() => streamAnswer(turnId, step), PAUSE_BEFORE_ANSWER_MS);
    };

    pendingAnswer = finishQuestion;
    status.emit('listening');
    words.forEach((_, index) =>
      schedule(
        () =>
          transcript.emit({
            turnId,
            text: words.slice(0, index + 1).join(' '),
            isFinal: false,
          }),
        index * WORD_INTERVAL_MS,
      ),
    );
    schedule(finishQuestion, words.length * WORD_INTERVAL_MS);
  };

  const scheduleNext = () => {
    const step = LIVE_SCENARIO[stepIndex];
    if (!step) return;
    stepIndex += 1;
    schedule(() => playStep(step), PAUSE_BETWEEN_TURNS_MS);
  };

  const start = () => {
    clearTimers();
    stepIndex = 0;
    turnCount = 0;
    status.emit('listening');
    scheduleNext();
  };

  const stop = () => {
    clearTimers();
    pendingAnswer = undefined;
    status.emit('idle');
  };

  const requestAnswer = () => pendingAnswer?.();

  const captureCode = () => {
    const codeIndex = LIVE_SCENARIO.findIndex((step) => step.code);
    const step = LIVE_SCENARIO[codeIndex];
    if (!step) return;
    clearTimers();
    stepIndex = codeIndex + 1;
    playStep(step);
  };

  return {
    start,
    stop,
    requestAnswer,
    captureCode,
    onTranscript: transcript.subscribe,
    onAnswer: answer.subscribe,
    onStatus: status.subscribe,
  };
};
