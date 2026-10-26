import { createSignal, onCleanup } from 'solid-js';

export const useDropdown = () => {
  const [opened, setOpened] = createSignal(false);
  let rootRef: HTMLDivElement | undefined;

  const setRootRef = (el: HTMLDivElement) => {
    rootRef = el;
  };

  const handleOutside = (event: PointerEvent) => {
    if (rootRef && !rootRef.contains(event.target as Node)) {
      close();
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };

  const listen = () => {
    document.addEventListener('pointerdown', handleOutside);
    document.addEventListener('keydown', handleEscape);
  };

  const unlisten = () => {
    document.removeEventListener('pointerdown', handleOutside);
    document.removeEventListener('keydown', handleEscape);
  };

  const close = () => {
    setOpened(false);
    unlisten();
  };

  const toggle = () => {
    if (opened()) {
      close();
      return;
    }
    setOpened(true);
    listen();
  };

  onCleanup(unlisten);

  return { opened, toggle, close, setRootRef };
};
