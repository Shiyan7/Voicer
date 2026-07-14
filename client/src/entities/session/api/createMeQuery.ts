import { createSignal } from 'solid-js';

import { ApiService } from '@/shared/api';
import { MinimalUserOutput } from '@/shared/api/types';
import { container } from '@/shared/di';

export function createMeQuery() {
  const api = container.resolve(ApiService);
  const [isPending, setIsPending] = createSignal(false);

  const query = async () => {
    setIsPending(true);

    try {
      return await api.get<MinimalUserOutput>('/users/me');
    } finally {
      setIsPending(false);
    }
  };

  return { query, isPending };
}
