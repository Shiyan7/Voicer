import { createSignal } from 'solid-js';

import { ApiService } from '@/shared/api';
import { AuthTokens, tokenStore } from '@/shared/api/tokenStore';
import { LoginDTO, MinimalUserOutput } from '@/shared/api/types';
import { container } from '@/shared/di';
import { isTauri } from '@/shared/isTauri';

export function createLoginMutation() {
  const api = container.resolve(ApiService);
  const [isPending, setIsPending] = createSignal(false);

  const mutateAsync = async (dto: LoginDTO) => {
    setIsPending(true);

    try {
      const tokens = await api.post<AuthTokens>('/auth/sign-in', dto);
      if (isTauri()) tokenStore.save(tokens);

      return await api.get<MinimalUserOutput>('/users/me');
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
}
