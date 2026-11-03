import { createContext, ParentProps, useContext } from 'solid-js';

import { createUserMe } from './createUserMe';

const UserMeContext = createContext<ReturnType<typeof createUserMe>>();

export function UserMeProvider(props: ParentProps) {
  const userMe = createUserMe();

  return (
    <UserMeContext.Provider value={userMe}>
      {props.children}
    </UserMeContext.Provider>
  );
}

export const useUserMe = () => {
  const context = useContext(UserMeContext);
  if (!context) {
    throw new Error('useUserMe must be used within UserMeProvider');
  }
  return context;
};
