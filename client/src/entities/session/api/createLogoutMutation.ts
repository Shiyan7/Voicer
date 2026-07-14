import { createSignal } from 'solid-js';

import { api } from '@/shared/api';
import { tokenStore } from '@/shared/api/tokenStore';

export function createLogoutMutation() {
  const [isPending, setIsPending] = createSignal(false);

  const mutateAsync = async () => {
    setIsPending(true);

    try {
      tokenStore.clear();

      return await api.post<{ ok: boolean }>('/auth/logout');
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}
