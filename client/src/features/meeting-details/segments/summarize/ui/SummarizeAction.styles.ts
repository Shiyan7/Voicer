import { tv } from 'tailwind-variants';

export const summarizeActionStyles = tv({
  slots: {
    root: `
      relative z-50 inline-flex items-center rounded-full bg-gray-900 text-white
      transition-transform active:scale-[0.98]
    `,
    summarize: `
      flex min-h-9 items-center rounded-l-full px-4 text-sm font-medium
      outline-none transition-colors hover:bg-gray-800 active:bg-gray-950
      focus-visible:ring-2 focus-visible:ring-gray-500/60
      disabled:pointer-events-none disabled:opacity-40
    `,
    divider: 'h-5 w-px bg-white/20',
    trigger: `
      flex min-h-9 items-center rounded-r-full px-3 outline-none
      focus-visible:ring-2 focus-visible:ring-gray-500/60
    `,
    chevron: 'rotate-90 transition-transform duration-200',
  },
  variants: {
    opened: {
      true: {
        chevron: '-rotate-90',
      },
    },
  },
});
