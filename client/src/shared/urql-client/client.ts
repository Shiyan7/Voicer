import {
  cacheExchange,
  createClient,
  fetchExchange,
  mapExchange,
  subscriptionExchange,
} from '@urql/solid';
import { SubscribePayload } from 'graphql-ws';

import { authRoot } from '../roots/authRoot';
import { isAuthError } from './lib/isAuthError';
import { wsClient } from './wsClient';

export const urqlClient = createClient({
  url: import.meta.env.VITE_GRAPHQL_API_URL,
  preferGetMethod: false,
  fetchOptions: () => {
    const token = authRoot.accessToken;
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  },
  exchanges: [
    cacheExchange,
    mapExchange({
      onError(error) {
        if (isAuthError(error)) authRoot.clear();
      },
    }),
    subscriptionExchange({
      forwardSubscription(operation) {
        return {
          subscribe: (sink) => {
            const dispose = wsClient.subscribe(
              operation as SubscribePayload,
              sink,
            );
            return {
              unsubscribe: dispose,
            };
          },
        };
      },
    }),
    fetchExchange,
  ],
});
