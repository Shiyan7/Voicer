import { createSignal, onCleanup, onMount } from 'solid-js';

function createMediaQuery(query: string) {
  const [matches, setMatches] = createSignal(false);

  let mediaQuery: MediaQueryList;

  const handler = (event: MediaQueryListEvent) => {
    setMatches(event.matches);
  };

  onMount(() => {
    mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
  });

  onCleanup(() => {
    mediaQuery?.removeEventListener('change', handler);
  });

  return matches;
}

export const isXs = createMediaQuery('(max-width: 320px)');
export const isSm = createMediaQuery('(max-width: 640px)');
export const isMd = createMediaQuery('(max-width: 768px)');
export const isLg = createMediaQuery('(max-width: 1024px)');
export const isXl = createMediaQuery('(max-width: 1280px)');
