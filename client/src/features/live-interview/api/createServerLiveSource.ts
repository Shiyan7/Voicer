import type { InterviewAnswerOutput } from '@schema';

import { i18n } from '@/shared/i18n';
import {
  captureScreenshot,
  startLiveCapture,
  stopLiveCapture,
} from '@/shared/lib/recorder';
import { authRoot } from '@/shared/roots/authRoot';

import { LIVE_AUDIO_PROTOCOL } from '../config/liveInterviewConfig';
import { buildLiveAudioUrl } from '../lib/buildLiveAudioUrl';
import { LiveServerMessage } from '../types/LiveServerMessage';
import { LiveSourceHandlers } from '../types/LiveSourceHandlers';
import { askInterviewScreenshot } from './askInterviewScreenshot';
import { subscribeInterviewAnswer } from './subscribeInterviewAnswer';

const utteranceTurnId = (utteranceId: number) => `utterance-${utteranceId}`;

export const createServerLiveSource = (
  sessionId: string,
  { onTurn, onStatus }: LiveSourceHandlers,
) => {
  const answerTurns = new Map<string, string>();
  const unmatchedAnswers = new Map<string, InterviewAnswerOutput>();
  const activeAnswers = new Set<string>();
  let socket: WebSocket | undefined;
  let unsubscribeAnswers: (() => void) | undefined;
  let screenshotCount = 0;
  let isActive = false;

  const emitStatus = () =>
    onStatus(activeAnswers.size > 0 ? 'answering' : 'listening');

  const beginAnswer = (id: string) => {
    activeAnswers.add(id);
    emitStatus();
  };

  const endAnswer = (id: string) => {
    activeAnswers.delete(id);
    emitStatus();
  };

  const emitAnswer = (turnId: string, output: InterviewAnswerOutput) => {
    onTurn({ id: turnId, answer: output.text });
    if (output.done) endAnswer(output.answerId);
  };

  const linkAnswer = (answerId: string, turnId: string) => {
    answerTurns.set(answerId, turnId);
    beginAnswer(answerId);
    const pending = unmatchedAnswers.get(answerId);
    unmatchedAnswers.delete(answerId);
    if (pending) emitAnswer(turnId, pending);
  };

  const onAnswerOutput = (output: InterviewAnswerOutput) => {
    const turnId = answerTurns.get(output.answerId);
    if (turnId) emitAnswer(turnId, output);
    else unmatchedAnswers.set(output.answerId, output);
  };

  const onServerMessage = (message: LiveServerMessage) => {
    if (message.type === 'transcript') {
      onTurn({
        id: utteranceTurnId(message.utteranceId),
        question: message.text,
      });
    }
    if (message.type === 'utteranceEnd') {
      onTurn({
        id: utteranceTurnId(message.utteranceId),
        isQuestionFinal: true,
      });
    }
    if (message.type === 'answerStarted') {
      linkAnswer(message.answerId, utteranceTurnId(message.utteranceId));
    }
  };

  const sendAudio = (pcm: Int16Array) => {
    if (socket?.readyState === WebSocket.OPEN) socket.send(pcm.slice());
  };

  const openSocket = () => {
    const url = buildLiveAudioUrl(
      import.meta.env.VITE_GRAPHQL_API_URL,
      sessionId,
    );
    const next = new WebSocket(url, [
      LIVE_AUDIO_PROTOCOL,
      authRoot.accessToken ?? '',
    ]);
    next.binaryType = 'arraybuffer';
    next.onmessage = (event: MessageEvent<string>) =>
      onServerMessage(JSON.parse(event.data) as LiveServerMessage);
    next.onclose = () => {
      if (isActive) onStatus('idle');
    };
    return next;
  };

  const start = () => {
    isActive = true;
    socket = openSocket();
    unsubscribeAnswers = subscribeInterviewAnswer(
      { sessionId },
      onAnswerOutput,
    );
    emitStatus();
    void startLiveCapture(sendAudio);
  };

  const stop = () => {
    isActive = false;
    void stopLiveCapture();
    socket?.close();
    socket = undefined;
    unsubscribeAnswers?.();
    unsubscribeAnswers = undefined;
    onStatus('idle');
  };

  const requestAnswer = () => {
    if (socket?.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: 'answerNow' }));
  };

  const captureCode = async () => {
    screenshotCount += 1;
    const turnId = `screenshot-${screenshotCount}`;
    onTurn({
      id: turnId,
      question: i18n.t('live.session.screenshot_question'),
      isQuestionFinal: true,
    });
    beginAnswer(turnId);
    try {
      const image = await captureScreenshot();
      const answerId = await askInterviewScreenshot({ sessionId, image });
      if (answerId) linkAnswer(answerId, turnId);
    } finally {
      endAnswer(turnId);
    }
  };

  return { start, stop, requestAnswer, captureCode };
};
