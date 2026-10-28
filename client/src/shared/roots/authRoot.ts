import type { AuthPayload } from '@schema';
import { makePersisted } from '@solid-primitives/storage';
import { createRoot, createSignal } from 'solid-js';

import { storage } from '../storage';

export const authRoot = createRoot(() => {
  const [accessToken, setAccessToken] = makePersisted(createSignal<string>(), {
    name: 'auth.accessToken',
    storage,
  });

  return {
    get isAuth() {
      return Boolean(accessToken());
    },
    get accessToken() {
      return accessToken();
    },
    saveToken(payload: AuthPayload) {
      setAccessToken(payload.accessToken);
    },
    clear() {
      setAccessToken('');
    },
  };
});
