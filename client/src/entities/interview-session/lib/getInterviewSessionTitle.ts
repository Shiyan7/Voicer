import type { InterviewSessionOutput } from '@schema';

import { i18n } from '@/shared/i18n';
import { withDateSuffix } from '@/shared/lib/time';

export const getInterviewSessionTitle = (
  session: Pick<InterviewSessionOutput, 'title' | 'createdAt'>,
): string =>
  session.title ||
  withDateSuffix(i18n.t('live.title_untitled'), session.createdAt);
