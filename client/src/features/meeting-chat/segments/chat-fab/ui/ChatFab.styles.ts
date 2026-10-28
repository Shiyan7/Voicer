import { tv } from 'tailwind-variants';

export const chatFabStyles = tv({
  slots: {
    root: `
      fixed z-[60] flex size-[60px] touch-none select-none items-center
      justify-center rounded-full frost-surface shadow-lg shadow-sky-900/10
      outline-none transition-[left,top,transform,box-shadow] duration-300
      ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 active:scale-95
      focus-visible:ring-2 focus-visible:ring-sky-400/60
    `,
    icon: 'transition-transform duration-300',
    badge: `
      absolute -right-0.5 -top-0.5 size-3 rounded-full bg-sky-500
      ring-2 ring-white animate-pulse
    `,
  },
  variants: {
    dragging: {
      true: {
        root: 'scale-110 cursor-grabbing shadow-xl transition-none hover:scale-110',
      },
    },
    open: {
      true: {
        icon: 'rotate-90',
      },
    },
  },
});
