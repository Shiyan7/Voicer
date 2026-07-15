import { createClient as createWsClient } from 'graphql-ws';

import { authRoot } from '../roots/authRoot';

export const wsClient = createWsClient({
  url: import.meta.env.VITE_GRAPHQL_API_URL?.replace('http', 'ws'),
  connectionParams: () => {
    const token = authRoot.accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});
