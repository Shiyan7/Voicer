import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

import { useLockScroll } from '@/shared/hooks/useLockScroll';
import { activeModals, MODALS } from '@/shared/lib/modal';

const ANIMATION_MS = 250;

export const useModal = (modalId: Accessor<MODALS>) => {
  const [mounted, setMounted] = createSignal(false);
  const [opened, setOpened] = createSignal(false);

  const isOpen = () => activeModals().includes(modalId());

  useLockScroll(isOpen);

  createEffect(() => {
    if (isOpen()) {
      setMounted(true);

      const frame = requestAnimationFrame(() => setOpened(true));
      onCleanup(() => cancelAnimationFrame(frame));
    } else {
      setOpened(false);

      const timer = setTimeout(() => setMounted(false), ANIMATION_MS);
      onCleanup(() => clearTimeout(timer));
    }
  });

  return { mounted, opened };
}
