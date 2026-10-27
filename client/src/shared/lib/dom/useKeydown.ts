import { onCleanup, onMount } from 'solid-js';

export const useKeydown = (handler: (event: KeyboardEvent) => void) => {
  onMount(() => window.addEventListener('keydown', handler));
  onCleanup(() => window.removeEventListener('keydown', handler));
};
