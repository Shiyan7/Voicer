import * as v from 'valibot';

import { i18n } from '@/shared/i18n';

export const createPrepSchema = () =>
  v.object({
    resume: v.pipe(
      v.file(i18n.t('live.prep.validation.resume')),
      v.mimeType(
        ['application/pdf'],
        i18n.t('live.prep.validation.resume_pdf'),
      ),
    ),
    vacancy: v.pipe(
      v.string(i18n.t('live.prep.validation.vacancy')),
      v.trim(),
      v.nonEmpty(i18n.t('live.prep.validation.vacancy')),
    ),
  });

export type PrepForm = v.InferInput<ReturnType<typeof createPrepSchema>>;
