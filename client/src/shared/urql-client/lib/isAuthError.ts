import { CombinedError } from '@urql/solid';

export const isAuthError = (error: CombinedError): boolean =>
  error.graphQLErrors.some((e) => e.extensions?.code === 'UNAUTHENTICATED');
