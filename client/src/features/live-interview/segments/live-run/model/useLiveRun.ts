import { createSignal, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';

import { uploadMeetingAudioMutation } from '@/entities/meeting';
import { useElapsedTimer } from '@/shared/hooks/useElapsedTimer';
import { i18n } from '@/shared/i18n';
import { readRecordingFile, stopRecording } from '@/shared/lib/recorder';
import { formatClock } from '@/shared/lib/time';

import { finishInterviewSession } from '../../../api/finishInterviewSession';
import { EMPTY_TURN } from '../../../config/liveInterviewConfig';
import { createLiveConnection } from '../../../lib/createLiveConnection';
import { ensureRecording } from '../../../lib/ensureRecording';
import { LiveConnectionHandlers } from '../../../types/LiveConnectionHandlers';
import { LiveStatus } from '../../../types/LiveStatus';
import { LiveTurn } from '../../../types/LiveTurn';
import { LiveRunDeps } from '../types/LiveRunDeps';

export function useLiveRun(deps: LiveRunDeps) {
  const [turns, setTurns] = createStore<LiveTurn[]>(deps.initialTurns);
  const [status, setStatus] = createSignal<LiveStatus>('idle');
  const [, uploadAudio] = uploadMeetingAudioMutation();
  const timer = useElapsedTimer();
  let isRecordingOwned = false;
  let isFinishing = false;

  const applyTurn: LiveConnectionHandlers['onTurn'] = (patch) => {
    const index = turns.findIndex((turn) => turn.id === patch.id);
    if (index < 0) setTurns(turns.length, { ...EMPTY_TURN, ...patch });
    else setTurns(index, patch);
  };

  const connection = createLiveConnection(deps.sessionId, {
    onTurn: applyTurn,
    onStatus: setStatus,
  });

  const startRecording = async () => {
    const { isOwned, startedAt } = await ensureRecording();
    isRecordingOwned = isOwned;
    timer.start(startedAt);
  };

  const stop = () => {
    connection.stop();
    timer.stop();
  };

  const dispose = () => {
    connection.dispose();
    timer.stop();
  };

  const saveRecording = async () => {
    try {
      const { path, startedAt, source } = await stopRecording();
      await uploadAudio({
        file: await readRecordingFile(path),
        source,
        startedAt: new Date(startedAt).toISOString(),
        interviewSessionId: deps.sessionId,
      });
    } catch (error) {
      console.error('[live-interview] failed to save recording:', error);
    }
  };

  const finish = async () => {
    if (isFinishing) return;
    isFinishing = true;
    stop();
    await Promise.all([
      finishInterviewSession({ id: deps.sessionId }),
      isRecordingOwned ? saveRecording() : Promise.resolve(),
    ]);
    deps.onFinished();
  };

  const timerLabel = () => formatClock(timer.elapsedSeconds());

  const statusLabel = () => i18n.t(`live.session.status.${status()}`);

  const isAnswering = () => status() === 'answering';

  const answerNow = () => connection.requestAnswer();

  const captureCode = () => void connection.captureCode();

  connection.start();
  void startRecording();
  onCleanup(dispose);

  return {
    turns,
    timerLabel,
    statusLabel,
    isAnswering,
    answerNow,
    captureCode,
    finish,
  };
}
