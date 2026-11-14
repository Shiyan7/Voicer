import { i18n } from '@/shared/i18n';
import {
  captureScreenshot,
  startLiveCapture,
  stopLiveCapture,
} from '@/shared/lib/recorder';

import { createAnswerTracker } from '../lib/createAnswerTracker';
import { LiveConnectionHandlers } from '../types/LiveConnectionHandlers';
import { LiveServerMessage } from '../types/LiveServerMessage';
import { LiveStatus } from '../types/LiveStatus';
import { askInterviewScreenshot } from './askInterviewScreenshot';
import { openLiveAudioSocket } from './openLiveAudioSocket';
import { subscribeInterviewAnswer } from './subscribeInterviewAnswer';

const utteranceTurnId = (utteranceId: number) => `utterance-${utteranceId}`;

export const createLiveConnection = (
  sessionId: string,
  { onTurn, onStatus }: LiveConnectionHandlers,
) => {
  let socket: ReturnType<typeof openLiveAudioSocket> | undefined;
  let unsubscribeAnswers: (() => void) | undefined;
  let screenshotCount = 0;
  let isActive = false;
  const imageUrls: string[] = [];

  const setActiveStatus = (status: LiveStatus) => {
    if (isActive) onStatus(status);
  };

  const tracker = createAnswerTracker({
    onAnswer: (id, answer) => onTurn({ id, answer }),
    onBusyChange: (isBusy) =>
      setActiveStatus(isBusy ? 'answering' : 'listening'),
  });

  const onServerMessage = (message: LiveServerMessage) => {
    const id = utteranceTurnId(message.utteranceId);
    switch (message.type) {
      case 'transcript':
        return onTurn({ id, question: message.text });
      case 'utteranceEnd':
        return onTurn({ id, isQuestionFinal: true });
      case 'answerStarted':
        return tracker.link(message.answerId, id);
    }
  };

  const stop = () => {
    if (!isActive) return;
    isActive = false;
    void stopLiveCapture();
    socket?.close();
    socket = undefined;
    unsubscribeAnswers?.();
    unsubscribeAnswers = undefined;
    onStatus('idle');
  };

  const beginAudioCapture = async () => {
    try {
      await startLiveCapture((pcm) => socket?.sendAudio(pcm));
      if (!isActive) await stopLiveCapture();
    } catch (error) {
      console.error('[live-interview] failed to start audio capture:', error);
      stop();
    }
  };

  const start = () => {
    if (isActive) return;
    isActive = true;
    socket = openLiveAudioSocket(sessionId, {
      onMessage: onServerMessage,
      onClose: stop,
    });
    unsubscribeAnswers = subscribeInterviewAnswer(
      { sessionId },
      tracker.receive,
    );
    onStatus('listening');
    void beginAudioCapture();
  };

  const dispose = () => {
    stop();
    imageUrls.forEach((url) => URL.revokeObjectURL(url));
    imageUrls.length = 0;
  };

  const requestAnswer = () => socket?.requestAnswer();

  const showScreenshot = (turnId: string, image: Blob) => {
    const imageUrl = URL.createObjectURL(image);
    imageUrls.push(imageUrl);
    onTurn({ id: turnId, imageUrl });
  };

  const askAboutScreenshot = async (turnId: string) => {
    const image = await captureScreenshot();
    showScreenshot(turnId, image);
    const answerId = await askInterviewScreenshot({ sessionId, image });
    if (!answerId) throw new Error('screenshot answer was not started');
    tracker.link(answerId, turnId);
  };

  const captureCode = async () => {
    if (!isActive) return;
    screenshotCount += 1;
    const turnId = `screenshot-${screenshotCount}`;
    onTurn({
      id: turnId,
      question: i18n.t('live.session.screenshot_question'),
      isQuestionFinal: true,
    });
    tracker.beginRequest();
    try {
      await askAboutScreenshot(turnId);
    } catch (error) {
      console.error('[live-interview] failed to ask about screenshot:', error);
      onTurn({ id: turnId, answer: i18n.t('live.session.screenshot_error') });
    } finally {
      tracker.endRequest();
    }
  };

  return { start, stop, dispose, requestAnswer, captureCode };
};
