import { createSignal } from 'solid-js';

import { tokenStore } from '@/shared/api/tokenStore';
import { MinimalUserOutput } from '@/shared/api/types';
import { useSingletonContext } from '@/shared/singleton-context';

import { createLogoutMutation } from '../api/createLogoutMutation';
import { createMeQuery } from '../api/createMeQuery';
import { createRefreshMutation } from '../api/createRefreshMutation';

export const createSession = () => {
  const me = createMeQuery();
  const refresh = createRefreshMutation();
  const logoutMutation = createLogoutMutation();

  const [user, setUser] = createSignal<MinimalUserOutput | null>(null);
  const [isAuthorized, setIsAuthorized] = createSignal(false);

  const login = (nextUser: MinimalUserOutput) => {
    setUser(nextUser);
    setIsAuthorized(true);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
    setIsAuthorized(false);
  };

  const restoreSession = async () => {
    try {
      await refresh.mutateAsync();
    } catch {
      tokenStore.clear();
      return;
    }

    try {
      login(await me.query());
    } catch {
      await logout();
    }
  };

  return { user, isAuthorized, login, restoreSession, logout };
};

export const useSession = () => useSingletonContext().session;
