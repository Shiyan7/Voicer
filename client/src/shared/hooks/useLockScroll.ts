import { Accessor, createEffect, onCleanup } from 'solid-js';

let lockCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

export const useLockScroll = (locked: Accessor<boolean>) => {
  createEffect(() => {
    if (!locked()) return;

    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;

      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    lockCount++;

    onCleanup(() => {
      lockCount--;
      if (lockCount === 0) {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      }
    });
  });
}

