import { cacheExchange, createClient, fetchExchange, subscriptionExchange } from '@urql/solid';
import { SubscribePayload } from 'graphql-ws';

import { authExchange } from './authExchange';
import { graphqlHttpUrl } from './url';
import { wsClient } from './wsClient';

export const urqlClient = createClient({
  url: graphqlHttpUrl,
  preferGetMethod: false,
  exchanges: [
    cacheExchange,
    authExchange,
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
