import { createSignal } from 'solid-js';

import { api } from '@/shared/api';
import { AuthTokens, tokenStore } from '@/shared/api/tokenStore';
import { isTauri } from '@/shared/isTauri';

export function createRefreshMutation() {
  const [isPending, setIsPending] = createSignal(false);

  const mutateAsync = async () => {
    setIsPending(true);

    try {
      const body = isTauri()
        ? { refreshToken: tokenStore.refreshToken ?? '' }
        : undefined;

      const tokens = await api.post<AuthTokens>('/auth/refresh', body);
      if (isTauri()) tokenStore.save(tokens);
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}
