import { createSignal } from 'solid-js';

export function useActionItem(isInitialDone: () => boolean) {
  const [isDone, setIsDone] = createSignal(isInitialDone());

  const toggle = () => {
    setIsDone((prev) => !prev);
  };

  return { isDone, toggle };
}
