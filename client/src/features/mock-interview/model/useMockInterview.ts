import { createSignal, onCleanup, onMount } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { startMicCapture, stopLiveCapture } from '@/shared/lib/recorder';

import { openMockInterviewSocket } from '../api/openMockInterviewSocket';
import { playInterviewerLine, stopSpeaking } from '../lib/speak';
import { MockInterviewProps } from '../types/MockInterviewProps';
import { MockPhase } from '../types/MockPhase';
import { MockServerMessage } from '../types/MockServerMessage';

export function useMockInterview(props: MockInterviewProps) {
  const [phase, setPhase] = createSignal<MockPhase>('thinking');
  const [question, setQuestion] = createSignal('');
  const [answer, setAnswer] = createSignal('');
  let socket: ReturnType<typeof openMockInterviewSocket> | undefined;

  const onSpeechEnd = () => {
    setPhase('listening');
    socket?.sendSpeechEnded();
  };

  const onMessage = (message: MockServerMessage) => {
    if (message.type === 'thinking') setPhase('thinking');
    if (message.type === 'interviewerFailed') setPhase('failed');
    if (message.type === 'transcript') {
      setAnswer(message.text);
      setPhase('listening');
    }
    if (message.type === 'stopSpeaking') {
      stopSpeaking();
      setAnswer('');
      setPhase('listening');
    }
    if (message.type === 'interviewerSpeech') {
      setQuestion(message.text);
      setAnswer('');
      setPhase('speaking');
      playInterviewerLine(message, onSpeechEnd);
    }
  };

  const release = () => {
    stopSpeaking();
    void stopLiveCapture();
    socket?.close();
    socket = undefined;
  };

  const start = () => {
    socket = openMockInterviewSocket(props.sessionId, {
      onMessage,
      onClose: () => setPhase('failed'),
    });
    startMicCapture((pcm) => socket?.sendAudio(pcm)).catch((error: unknown) => {
      console.error('[mock-interview] mic capture failed:', error);
      setPhase('failed');
    });
  };

  const retry = () => {
    release();
    setPhase('thinking');
    start();
  };

  const finish = () => {
    release();
    props.onFinish();
  };

  const statusLabel = () => i18n.t(`live.session.mock.${phase()}`);

  const isFailed = () => phase() === 'failed';

  const isListening = () => phase() === 'listening';

  onMount(start);
  onCleanup(release);

  return {
    question,
    answer,
    statusLabel,
    isFailed,
    isListening,
    retry,
    finish,
  };
}
