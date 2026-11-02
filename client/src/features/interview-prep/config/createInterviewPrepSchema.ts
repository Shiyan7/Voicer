import * as v from 'valibot';

import { i18n } from '@/shared/i18n';

export const createInterviewPrepSchema = () =>
  v.pipe(
    v.object({
      vacancy: v.pipe(
        v.string(),
        v.trim(),
        v.nonEmpty(i18n.t('live.prep.vacancy_required')),
      ),
      resumeFile: v.optional(v.file()),
      resumeSessionId: v.optional(v.string()),
    }),
    v.forward(
      v.partialCheck(
        [['resumeFile'], ['resumeSessionId']],
        (input) => !!input.resumeFile || !!input.resumeSessionId,
        i18n.t('live.prep.resume_required'),
      ),
      ['resumeSessionId'],
    ),
  );

export type InterviewPrepForm = v.InferInput<
  ReturnType<typeof createInterviewPrepSchema>
>;
