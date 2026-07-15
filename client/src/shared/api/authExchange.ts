import { authExchange as makeAuthExchange } from '@urql/exchange-auth';

import { authRoot } from '../roots/authRoot';
import { REFRESH_MUTATION } from './gql/REFRESH_MUTATION';

export const authExchange = makeAuthExchange(async (utils) => ({
  addAuthToOperation(operation) {
    const token = authRoot.accessToken;
    if (!token) return operation;
    return utils.appendHeaders(operation, {
      Authorization: `Bearer ${token}`,
    });
  },
  didAuthError(error) {
    return (
      error.response?.status === 401 ||
      error.graphQLErrors.some((e) => e.extensions?.code === 'UNAUTHENTICATED')
    );
  },
  async refreshAuth() {
    const result = await utils.mutate(REFRESH_MUTATION, {
      input: { refreshToken: authRoot.refreshToken ?? '' },
    });

    if (result.data?.refresh) {
      authRoot.saveToken(result.data.refresh);
    } else {
      authRoot.clear();
    }
  },
}));
