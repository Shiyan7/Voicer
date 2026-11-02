import { useNavigate, useParams } from '@solidjs/router';

import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';

import { useInterviewPreparation } from './useInterviewPreparation';
import { useTitleDots } from './useTitleDots';

export function useInterviewBriefing() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sessionId = () => params.id;
  const { session, isPreparing, isReady, isFailed, retry } =
    useInterviewPreparation(sessionId);
  const { dots } = useTitleDots();

  const title = () => {
    const base = i18n.t('live.prep.title');
    return isPreparing() ? base + dots() : (session()?.title ?? base);
  };

  const briefing = () => (isReady() ? session() : undefined);

  const start = () => navigate(paths.liveSession(sessionId()));

  const goBack = () => navigate(paths.live);

  return {
    title,
    isPreparing,
    isFailed,
    retry,
    briefing,
    start,
    goBack,
  };
}
