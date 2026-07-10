import * as v from 'valibot';

import { i18n } from '@/shared/i18n';

export const createAuthSchema = () =>
  v.object({
    email: v.pipe(
      v.string(),
      v.nonEmpty(i18n.t('validation.required.email')),
      v.email(i18n.t('validation.email.invalid')),
    ),
    password: v.pipe(
      v.string(),
      v.nonEmpty(i18n.t('validation.required.password')),
      v.minLength(6, i18n.t('validation.common.minLength', { min: 6 })),
    ),
  });

export type AuthForm = v.InferInput<ReturnType<typeof createAuthSchema>>;
