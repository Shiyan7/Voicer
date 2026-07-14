import { makePersisted } from '@solid-primitives/storage';
import { tauriStorage } from '@solid-primitives/storage/tauri';
import { createRoot, createSignal } from 'solid-js';

import { isTauri } from '../isTauri';

export type AuthTokens = {
  accessToken?: string;
  refreshToken?: string;
};

const storage = isTauri() ? tauriStorage() : localStorage;

export const authRoot = createRoot(() => {
  const [accessToken, setAccessToken] = makePersisted(createSignal<string>(), {
    name: 'auth.accessToken',
    storage,
  });

  const [refreshToken, setRefreshToken] = makePersisted(
    createSignal<string>(),
    {
      name: 'auth.refreshToken',
      storage,
    },
  );

  return {
    get accessToken() {
      return accessToken();
    },

    get refreshToken() {
      return refreshToken();
    },

    saveToken(tokens: AuthTokens) {
      if (tokens.accessToken) setAccessToken(tokens.accessToken);
      if (tokens.refreshToken) setRefreshToken(tokens.refreshToken);
    },

    clear() {
      setAccessToken('');
      setRefreshToken('');
    },
  };
});
