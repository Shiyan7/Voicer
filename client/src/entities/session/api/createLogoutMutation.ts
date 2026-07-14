import { createSignal } from 'solid-js';

import { ApiService } from '@/shared/api';
import { tokenStore } from '@/shared/api/tokenStore';
import { container } from '@/shared/di';

export function createLogoutMutation() {
  const api = container.resolve(ApiService);
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
