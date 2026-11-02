import {
  InterviewPrepStatus,
  type InterviewRecommendationsOutput,
} from '@schema';
import { createEffect, createSignal, on, onCleanup } from 'solid-js';

import { fetchInterviewPreparation } from '../api/fetchInterviewPreparation';
import { retryInterviewPreparationMutation } from '../api/retryInterviewPreparationMutation';
import { PREPARATION_POLL_MS } from '../config/PREPARATION_POLL_MS';

export function useInterviewPreparation(sessionId: () => string) {
  const [status, setStatus] = createSignal(InterviewPrepStatus.Preparing);
  const [recommendations, setRecommendations] =
    createSignal<InterviewRecommendationsOutput>();
  const [, retryPreparation] = retryInterviewPreparationMutation();
  let timer: ReturnType<typeof setTimeout> | undefined;

  const stopPolling = () => clearTimeout(timer);

  const poll = async () => {
    stopPolling();
    const session = await fetchInterviewPreparation(sessionId());
    if (!session) {
      setStatus(InterviewPrepStatus.Failed);
      return;
    }
    setStatus(session.prepStatus);
    setRecommendations(session.recommendations);
    if (session.prepStatus === InterviewPrepStatus.Preparing) {
      timer = setTimeout(() => void poll(), PREPARATION_POLL_MS);
    }
  };

  const retry = async () => {
    setStatus(InterviewPrepStatus.Preparing);
    await retryPreparation({ id: sessionId() });
    await poll();
  };

  const isPreparing = () => status() === InterviewPrepStatus.Preparing;

  const isReady = () => status() === InterviewPrepStatus.Ready;

  const isFailed = () => status() === InterviewPrepStatus.Failed;

  createEffect(on(sessionId, () => void poll()));

  onCleanup(stopPolling);

  return { isPreparing, isReady, isFailed, recommendations, retry };
}
