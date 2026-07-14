import { createSignal } from 'solid-js';

import { api } from '@/shared/api';
import { MinimalUserOutput } from '@/shared/api/types';

export function createMeQuery() {
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
