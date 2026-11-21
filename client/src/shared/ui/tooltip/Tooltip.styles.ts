import { tv } from 'tailwind-variants';

export const tooltipStyles = tv({
  slots: {
    root: 'inline-flex',
    bubble: `
      pointer-events-none fixed z-[100] rounded-lg bg-gray-900 px-2.5 py-1
      text-[12px] font-medium text-white shadow-lg animate-tooltip-in
    `,
  },
  variants: {
    position: {
      top: {
        bubble: '-translate-x-1/2 -translate-y-full whitespace-nowrap',
      },
      right: {
        bubble: `
          max-w-72 -translate-y-1/2 rounded-xl border border-gray-200
          bg-white px-3.5 py-2 text-[14px] font-normal leading-snug
          text-gray-900 shadow-none [animation-delay:400ms]
        `,
      },
    },
  },
});
