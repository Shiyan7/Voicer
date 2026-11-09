import { InterviewPrepStatus } from '@schema';
import { useNavigate, useParams } from '@solidjs/router';
import { createEffect, createSignal, on } from 'solid-js';

import { paths } from '@/shared/router';

import { fetchInterviewSession } from '../api/fetchInterviewSession';
import { fetchInterviewTurns } from '../api/fetchInterviewTurns';
import { toCompletedTurn } from '../lib/toCompletedTurn';
import { LoadedInterview } from '../types/LoadedInterview';

export function useLiveInterview() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loaded, setLoaded] = createSignal<LoadedInterview>();

  const open = async (id: string) => {
    const [details, turns] = await Promise.all([
      fetchInterviewSession(id),
      fetchInterviewTurns(id),
    ]);
    if (!details) {
      navigate(paths.live, { replace: true });
      return;
    }
    if (
      !details.finishedAt &&
      details.prepStatus !== InterviewPrepStatus.Ready
    ) {
      navigate(paths.liveBriefing(id), { replace: true });
      return;
    }
    setLoaded({ details, turns: turns.map(toCompletedTurn) });
  };

  const reload = () => void open(params.id);

  const closeReview = () => navigate(paths.live);

  createEffect(on(() => params.id, reload));

  return { loaded, reload, closeReview };
}
