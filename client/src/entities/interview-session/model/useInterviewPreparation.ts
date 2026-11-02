import { InterviewPrepStatus } from '@schema';
import { createEffect, createSignal, on, onCleanup } from 'solid-js';

import { fetchInterviewPreparation } from '../api/fetchInterviewPreparation';
import { retryInterviewPreparationMutation } from '../api/retryInterviewPreparationMutation';
import { PREPARATION_POLL_MS } from '../config/PREPARATION_POLL_MS';

export function useInterviewPreparation(sessionId: () => string) {
  const [status, setStatus] = createSignal(InterviewPrepStatus.Preparing);
  const [session, setSession] =
    createSignal<Awaited<ReturnType<typeof fetchInterviewPreparation>>>();
  const [, retryPreparation] = retryInterviewPreparationMutation();
  let timer: ReturnType<typeof setTimeout> | undefined;

  const stopPolling = () => clearTimeout(timer);

  const poll = async () => {
    stopPolling();
    const found = await fetchInterviewPreparation(sessionId());
    if (!found) {
      setStatus(InterviewPrepStatus.Failed);
      return;
    }
    setSession(found);
    setStatus(found.prepStatus);
    if (found.prepStatus === InterviewPrepStatus.Preparing) {
      timer = setTimeout(() => void poll(), PREPARATION_POLL_MS);
    }
  };

  const retry = async () => {
    setStatus(InterviewPrepStatus.Preparing);
    await retryPreparation({ id: sessionId() });
    await poll();
  };

  const recommendations = () => session()?.recommendations;

  const isPreparing = () => status() === InterviewPrepStatus.Preparing;

  const isReady = () => status() === InterviewPrepStatus.Ready;

  const isFailed = () => status() === InterviewPrepStatus.Failed;

  createEffect(on(sessionId, () => void poll()));

  onCleanup(stopPolling);

  return { session, isPreparing, isReady, isFailed, recommendations, retry };
}
