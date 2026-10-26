import { tv } from 'tailwind-variants';

export const summarizeActionStyles = tv({
  slots: {
    root: `
      relative z-50 inline-flex animate-ai-flow items-center rounded-full
      bg-[linear-gradient(110deg,#ec4899,#a855f7,#6366f1,#a855f7,#ec4899)]
      bg-[length:300%_100%] text-ai-foreground
      shadow-[0_0_20px_-4px_rgba(236,72,153,0.45),0_0_32px_-8px_rgba(120,115,245,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]
      transition-[transform,box-shadow] duration-300
      hover:shadow-[0_0_26px_-4px_rgba(236,72,153,0.6),0_0_40px_-6px_rgba(120,115,245,0.65),inset_0_1px_0_rgba(255,255,255,0.25)]
      active:scale-[0.98]
    `,
    summarize: `
      flex min-h-9 items-center gap-2 rounded-l-full pl-4 pr-3 text-sm
      font-medium outline-none transition-colors hover:bg-white/10
      active:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/60
      disabled:pointer-events-none disabled:opacity-40
    `,
    divider: 'h-5 w-px bg-white/25',
    trigger: `
      flex min-h-9 items-center rounded-r-full pl-2.5 pr-3 outline-none
      transition-colors hover:bg-white/10 active:bg-white/5
      focus-visible:ring-2 focus-visible:ring-white/60
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
