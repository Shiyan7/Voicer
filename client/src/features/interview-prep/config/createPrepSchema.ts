import * as v from 'valibot';

import { i18n } from '@/shared/i18n';

export type PrepForm = {
  resume?: File;
  vacancy: string;
};

const createResumeFileSchema = () =>
  v.pipe(
    v.file(i18n.t('live.prep.validation.resume')),
    v.mimeType(['application/pdf'], i18n.t('live.prep.validation.resume_pdf')),
  );

export const createPrepSchema = (hasSelectedResume: boolean) =>
  v.object({
    resume: hasSelectedResume
      ? v.optional(createResumeFileSchema())
      : createResumeFileSchema(),
    vacancy: v.pipe(
      v.string(i18n.t('live.prep.validation.vacancy')),
      v.trim(),
      v.nonEmpty(i18n.t('live.prep.validation.vacancy')),
    ),
  });
