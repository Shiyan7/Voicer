import { useContext } from 'solid-js';

import { DIContext } from './DIContext';

export function useViewModel<T>(ViewModel: new (...args: any[]) => T): T {
  const container = useContext(DIContext);

  try {
    return container.resolve(ViewModel);
  } catch {
    return new ViewModel();
  }
}
