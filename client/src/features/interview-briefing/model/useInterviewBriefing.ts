import { InterviewPrepStatus } from '@schema';
import { useNavigate, useParams } from '@solidjs/router';

import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';

import { useInterviewPreparation } from './useInterviewPreparation';
import { useTitleDots } from './useTitleDots';

export function useInterviewBriefing() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sessionId = () => params.id;
  const { session, status, retry } = useInterviewPreparation(sessionId);
  const isPreparing = () => status() === InterviewPrepStatus.Preparing;
  const { dots } = useTitleDots(isPreparing);

  const title = () => {
    const base = i18n.t('live.prep.title');
    return isPreparing() ? base + dots() : (session()?.title ?? base);
  };

  const start = () => navigate(paths.liveSession(sessionId()));

  const goBack = () => navigate(paths.live);

  return {
    title,
    status,
    retry,
    session,
    start,
    goBack,
  };
}
