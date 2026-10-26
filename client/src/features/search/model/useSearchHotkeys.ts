import { onCleanup, onMount } from 'solid-js';

interface SearchHotkeysParams {
  isOpen: () => boolean;
  onToggle: () => void;
  onMove: (step: number) => void;
  onSubmit: () => void;
}

const isOpenShortcut = (event: KeyboardEvent) =>
  (event.metaKey || event.ctrlKey) && event.code === 'KeyK';

export const useSearchHotkeys = (params: SearchHotkeysParams) => {
  const handleKeydown = (event: KeyboardEvent) => {
    if (isOpenShortcut(event)) {
      event.preventDefault();
      params.onToggle();
      return;
    }

    if (!params.isOpen()) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      params.onMove(event.key === 'ArrowDown' ? 1 : -1);
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      params.onSubmit();
    }
  };

  onMount(() => window.addEventListener('keydown', handleKeydown));
  onCleanup(() => window.removeEventListener('keydown', handleKeydown));
};
