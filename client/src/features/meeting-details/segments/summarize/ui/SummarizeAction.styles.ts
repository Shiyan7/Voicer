import { tv } from 'tailwind-variants';

export const summarizeActionStyles = tv({
  slots: {
    root: `
      relative z-50 inline-flex frost-surface items-center rounded-full
      transition-transform duration-300
      active:scale-[0.98]
    `,
    summarize: `
      flex min-h-11 items-center gap-2 rounded-l-full pl-5 pr-3.5 text-[15px]
      font-medium outline-none transition-colors hover:bg-slate-900/5
      active:bg-slate-900/10 focus-visible:ring-2 focus-visible:ring-sky-400/60
      disabled:pointer-events-none disabled:opacity-40
    `,
    divider: 'h-6 w-px bg-slate-900/15',
    trigger: `
      flex min-h-11 items-center rounded-r-full pl-3 pr-4 outline-none
      transition-colors hover:bg-slate-900/5 active:bg-slate-900/10
      focus-visible:ring-2 focus-visible:ring-sky-400/60
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
