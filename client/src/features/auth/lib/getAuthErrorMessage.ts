import { CombinedError } from '@urql/solid';

import { i18n } from '@/shared/i18n';

export const getAuthErrorMessage = (error: CombinedError): string => {
  const code = error.graphQLErrors[0]?.extensions?.code;

  if (code === 'CONFLICT') return i18n.t('auth.error.email_taken');
  if (code === 'BAD_REQUEST') return i18n.t('auth.error.invalid_credentials');
  return i18n.t('auth.error.unknown');
};
