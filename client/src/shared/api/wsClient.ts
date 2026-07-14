import { createClient as createWsClient } from 'graphql-ws';

import { authRoot } from '../roots/authRoot';
import { graphqlHttpUrl } from './url';

const wsUrl = graphqlHttpUrl.replace(/^http/, 'ws');

export const wsClient = createWsClient({
  url: wsUrl,
  connectionParams: () => {
    const token = authRoot.accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});
