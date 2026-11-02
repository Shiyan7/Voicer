import { createSignal, onCleanup } from 'solid-js';

import {
  TITLE_DOTS_INTERVAL_MS,
  TITLE_DOTS_MAX,
} from '../config/briefingConfig';

export function useTitleDots() {
  const [count, setCount] = createSignal(0);
  const timer = setInterval(
    () => setCount((current) => (current + 1) % (TITLE_DOTS_MAX + 1)),
    TITLE_DOTS_INTERVAL_MS,
  );

  onCleanup(() => clearInterval(timer));

  const dots = () => '.'.repeat(count());

  return { dots };
}
