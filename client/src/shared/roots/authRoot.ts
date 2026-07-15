import { makePersisted } from '@solid-primitives/storage';
import { createRoot, createSignal } from 'solid-js';

import { storage } from '../storage';

export type AuthPayload = {
  accessToken?: string;
};

export const authRoot = createRoot(() => {
  const [accessToken, setAccessToken] = makePersisted(createSignal<string>(), {
    name: 'auth.accessToken',
    storage,
  });

  return {
    get accessToken() {
      return accessToken();
    },
    saveToken(payload: AuthPayload) {
      if (payload.accessToken) setAccessToken(payload.accessToken);
    },
    clear() {
      setAccessToken('');
    },
  };
});
