import { authRoot } from '@/shared/roots/authRoot';

import { userMeQuery } from '../api/userMeQuery';

export const createUserMe = () => {
  const [userMeResult] = userMeQuery({
    pause: () => !authRoot.isAuth,
  });

  const user = () =>
    authRoot.isAuth ? (userMeResult.data?.userMe ?? null) : null;

  const isAuthorized = () => Boolean(authRoot.accessToken);

  return { user, isAuthorized };
};
