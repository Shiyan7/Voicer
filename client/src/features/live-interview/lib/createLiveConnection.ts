import { i18n } from '@/shared/i18n';
import {
  captureScreenshot,
  startLiveCapture,
  stopLiveCapture,
} from '@/shared/lib/recorder';

import { askInterviewScreenshot } from '../api/askInterviewScreenshot';
import { openLiveAudioSocket } from '../api/openLiveAudioSocket';
import { subscribeInterviewAnswer } from '../api/subscribeInterviewAnswer';
import { LiveConnectionHandlers } from '../types/LiveConnectionHandlers';
import { LiveServerMessage } from '../types/LiveServerMessage';
import { createAnswerTracker } from './createAnswerTracker';

const utteranceTurnId = (utteranceId: number) => `utterance-${utteranceId}`;

export const createLiveConnection = (
  sessionId: string,
  { onTurn, onStatus }: LiveConnectionHandlers,
) => {
  const tracker = createAnswerTracker({
    onAnswer: (id, answer) => onTurn({ id, answer }),
    onBusyChange: (isBusy) => onStatus(isBusy ? 'answering' : 'listening'),
  });
  let socket: ReturnType<typeof openLiveAudioSocket> | undefined;
  let unsubscribeAnswers: (() => void) | undefined;
  let screenshotCount = 0;
  let isActive = false;

  const onServerMessage = (message: LiveServerMessage) => {
    const id = utteranceTurnId(message.utteranceId);
    if (message.type === 'transcript') onTurn({ id, question: message.text });
    if (message.type === 'utteranceEnd') onTurn({ id, isQuestionFinal: true });
    if (message.type === 'answerStarted') tracker.link(message.answerId, id);
  };

  const start = () => {
    isActive = true;
    socket = openLiveAudioSocket(sessionId, {
      onMessage: onServerMessage,
      onClose: () => {
        if (isActive) onStatus('idle');
      },
    });
    unsubscribeAnswers = subscribeInterviewAnswer(
      { sessionId },
      tracker.receive,
    );
    onStatus('listening');
    void startLiveCapture((pcm) => socket?.sendAudio(pcm));
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

  const requestAnswer = () => socket?.requestAnswer();

  const captureCode = async () => {
    screenshotCount += 1;
    const turnId = `screenshot-${screenshotCount}`;
    onTurn({
      id: turnId,
      question: i18n.t('live.session.screenshot_question'),
      isQuestionFinal: true,
    });
    tracker.beginRequest();
    try {
      const image = await captureScreenshot();
      const answerId = await askInterviewScreenshot({ sessionId, image });
      if (answerId) tracker.link(answerId, turnId);
    } finally {
      tracker.endRequest();
    }
  };

  return { start, stop, requestAnswer, captureCode };
};
