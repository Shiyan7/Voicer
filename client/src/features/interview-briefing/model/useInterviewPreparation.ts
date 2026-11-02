import { InterviewPrepStatus } from '@schema';
import { createEffect, createSignal, on, onCleanup } from 'solid-js';

import { fetchInterviewPreparation } from '../api/fetchInterviewPreparation';
import { retryInterviewPreparationMutation } from '../api/retryInterviewPreparationMutation';
import { PREPARATION_POLL_MS } from '../config/briefingConfig';
import { InterviewPreparation } from '../types/InterviewPreparation';

export function useInterviewPreparation(sessionId: () => string) {
  const [session, setSession] = createSignal<InterviewPreparation | null>();
  const [, retryPreparation] = retryInterviewPreparationMutation();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let isDisposed = false;

  const status = () => {
    const current = session();
    if (current === undefined) return InterviewPrepStatus.Preparing;
    return current?.prepStatus ?? InterviewPrepStatus.Failed;
  };

  const poll = async () => {
    clearTimeout(timer);
    const found = await fetchInterviewPreparation(sessionId());
    if (isDisposed) return;
    setSession(found);
    if (found?.prepStatus === InterviewPrepStatus.Preparing) {
      timer = setTimeout(() => void poll(), PREPARATION_POLL_MS);
    }
  };

  const retry = async () => {
    setSession(undefined);
    await retryPreparation({ id: sessionId() });
    await poll();
  };

  createEffect(on(sessionId, () => void poll()));

  onCleanup(() => {
    isDisposed = true;
    clearTimeout(timer);
  });

  return { session, status, retry };
}
