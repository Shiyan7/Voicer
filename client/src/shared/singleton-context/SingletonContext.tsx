import { createContext, ParentProps, useContext } from 'solid-js';

import { createSession } from '@/entities/session';
import { createToasts } from '@/entities/toasts';

type SingletonContextValue = {
  session: ReturnType<typeof createSession>;
  toasts: ReturnType<typeof createToasts>;
};

const SingletonContext = createContext<SingletonContextValue>();

export function SingletonProvider(props: ParentProps) {
  const session = createSession();
  const toasts = createToasts();

  return (
    <SingletonContext.Provider
      value={{
        session,
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
