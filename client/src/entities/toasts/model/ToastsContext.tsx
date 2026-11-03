import { createContext, ParentProps, useContext } from 'solid-js';

import { createToasts } from './createToasts';

const ToastsContext = createContext<ReturnType<typeof createToasts>>();

export function ToastsProvider(props: ParentProps) {
  const toasts = createToasts();

  return (
    <ToastsContext.Provider value={toasts}>
      {props.children}
    </ToastsContext.Provider>
  );
}

export const useToasts = () => {
  const context = useContext(ToastsContext);
  if (!context) {
    throw new Error('useToasts must be used within ToastsProvider');
  }
  return context;
};
