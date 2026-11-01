import type { InterviewAnswerOutput } from '@schema';

import { i18n } from '@/shared/i18n';
import {
  captureScreenshot,
  startLiveCapture,
  stopLiveCapture,
} from '@/shared/lib/recorder/liveCaptureBridge';
import { authRoot } from '@/shared/roots/authRoot';

import { buildLiveAudioUrl } from '../lib/buildLiveAudioUrl';
import { createEmitter } from '../lib/createEmitter';
import { parseLiveServerMessage } from '../lib/parseLiveServerMessage';
import { splitAnswer } from '../lib/splitAnswer';
import { LiveAnswerUpdate } from '../types/LiveAnswerUpdate';
import { LiveServerMessage } from '../types/LiveServerMessage';
import { LiveSource } from '../types/LiveSource';
import { LiveStatus } from '../types/LiveStatus';
import { LiveTranscriptEvent } from '../types/LiveTranscriptEvent';
import { askInterviewScreenshot } from './askInterviewScreenshot';
import { subscribeInterviewAnswer } from './subscribeInterviewAnswer';

const utteranceTurnId = (utteranceId: number) => `utterance-${utteranceId}`;

export const createServerLiveSource = (sessionId: string): LiveSource => {
  const transcript = createEmitter<LiveTranscriptEvent>();
  const answer = createEmitter<LiveAnswerUpdate>();
  const status = createEmitter<LiveStatus>();
  const answerTurns = new Map<string, string>();
  const unmatchedAnswers = new Map<string, InterviewAnswerOutput>();
  const utteranceTexts = new Map<number, string>();
  let socket: WebSocket | undefined;
  let unsubscribeAnswers: (() => void) | undefined;
  let screenshotCount = 0;
  let isActive = false;

  const emitAnswer = (turnId: string, output: InterviewAnswerOutput) => {
    answer.emit({ turnId, ...splitAnswer(output.text), isDone: output.done });
    status.emit(output.done ? 'listening' : 'answering');
  };

  const linkAnswer = (answerId: string, turnId: string) => {
    answerTurns.set(answerId, turnId);
    const pending = unmatchedAnswers.get(answerId);
    unmatchedAnswers.delete(answerId);
    if (pending) emitAnswer(turnId, pending);
    else status.emit('answering');
  };

  const onAnswerOutput = (output: InterviewAnswerOutput) => {
    const turnId = answerTurns.get(output.answerId);
    if (turnId) emitAnswer(turnId, output);
    else unmatchedAnswers.set(output.answerId, output);
  };

  const onServerMessage = (message: LiveServerMessage) => {
    if (message.type === 'transcript') {
      utteranceTexts.set(message.utteranceId, message.text);
      transcript.emit({
        turnId: utteranceTurnId(message.utteranceId),
        text: message.text,
        isFinal: false,
      });
    }
    if (message.type === 'utteranceEnd') {
      transcript.emit({
        turnId: utteranceTurnId(message.utteranceId),
        text: utteranceTexts.get(message.utteranceId) ?? '',
        isFinal: true,
      });
      utteranceTexts.delete(message.utteranceId);
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
      authRoot.accessToken ?? '',
      sessionId,
    );
    const next = new WebSocket(url);
    next.binaryType = 'arraybuffer';
    next.onmessage = (event) => {
      const message = parseLiveServerMessage(event.data);
      if (message) onServerMessage(message);
    };
    next.onclose = () => {
      if (isActive) status.emit('idle');
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
    status.emit('listening');
    startLiveCapture(sendAudio).catch(() => status.emit('idle'));
  };

  const stop = () => {
    isActive = false;
    void stopLiveCapture().catch(() => undefined);
    socket?.close();
    socket = undefined;
    unsubscribeAnswers?.();
    unsubscribeAnswers = undefined;
    status.emit('idle');
  };

  const requestAnswer = () => {
    if (socket?.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: 'answerNow' }));
  };

  const captureCode = async () => {
    screenshotCount += 1;
    const turnId = `screenshot-${screenshotCount}`;
    transcript.emit({
      turnId,
      text: i18n.t('live.session.screenshot_question'),
      isFinal: true,
    });
    status.emit('answering');
    try {
      const image = new File([await captureScreenshot()], 'screenshot.png', {
        type: 'image/png',
      });
      const answerId = await askInterviewScreenshot({ sessionId, image });
      if (answerId) linkAnswer(answerId, turnId);
    } catch {
      status.emit('listening');
    }
  };

  return {
    start,
    stop,
    requestAnswer,
    captureCode: () => void captureCode(),
    onTranscript: transcript.subscribe,
    onAnswer: answer.subscribe,
    onStatus: status.subscribe,
  };
};
