import { authRoot } from '@/shared/roots/authRoot';
import { useSingletonContext } from '@/shared/singleton-context';

import { userMeQuery } from '../api/userMeQuery';

export const createUserMe = () => {
  const [userMeResult] = userMeQuery(() => !authRoot.accessToken);

  const user = () => userMeResult.data?.userMe ?? null;

  const isAuthorized = () => Boolean(authRoot.accessToken);

  return { user, isAuthorized };
};

export const useUserMe = () => useSingletonContext().userMe;
