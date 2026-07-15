import { createContext, ParentProps, useContext } from 'solid-js';

import { createToasts } from '@/entities/toasts';
import { createUserMe } from '@/entities/user-me';

type SingletonContextValue = {
  userMe: ReturnType<typeof createUserMe>;
  toasts: ReturnType<typeof createToasts>;
};

const SingletonContext = createContext<SingletonContextValue>();

export function SingletonProvider(props: ParentProps) {
  const userMe = createUserMe();
  const toasts = createToasts();

  return (
    <SingletonContext.Provider
      value={{
        userMe,
        toasts,
      }}
    >
      {props.children}
    </SingletonContext.Provider>
  );
}

export const useSingletonContext = () => {
  const ctx = useContext(SingletonContext);
  if (!ctx) {
    throw new Error(
      'useSingletonContext must be used within SingletonProvider',
    );
  }
  return ctx;
};
