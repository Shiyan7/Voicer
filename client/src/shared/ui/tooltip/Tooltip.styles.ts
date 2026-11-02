import { tv } from 'tailwind-variants';

export const tooltipStyles = tv({
  slots: {
    root: 'group relative inline-flex',
    bubble: `
      pointer-events-none absolute bottom-full left-1/2 z-10 mb-2
      -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1
      text-[12px] font-medium text-white opacity-0 shadow-lg
      transition-opacity duration-150 group-hover:opacity-100
    `,
  },
  variants: {
    open: {
      true: { bubble: 'opacity-100' },
    },
  },
});
