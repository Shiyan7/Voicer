import { authRoot } from '@/shared/roots/authRoot';
import { useSingletonContext } from '@/shared/singleton';

import { userMeQuery } from '../api/userMeQuery';

export const createUserMe = () => {
  const [userMeResult] = userMeQuery({
    pause: () => !authRoot.isAuth,
  });

  const user = () => userMeResult.data?.userMe ?? null;

  const isAuthorized = () => Boolean(authRoot.accessToken);

  return { user, isAuthorized };
};

export const useUserMe = () => useSingletonContext().userMe;
