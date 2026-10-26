import { tv } from 'tailwind-variants';

export const summarizeActionStyles = tv({
  slots: {
    root: `
      relative z-50 inline-flex animate-ai-flow items-center rounded-full
      bg-[linear-gradient(110deg,#3b82f6,#6366f1,#8b5cf6,#c026d3,#ec4899,#c026d3,#8b5cf6,#6366f1,#3b82f6)]
      bg-[length:400%_100%] text-ai-foreground
      shadow-[0_0_20px_-4px_rgba(139,92,246,0.5),0_0_32px_-8px_rgba(236,72,153,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]
      transition-[transform,box-shadow] duration-300
      hover:shadow-[0_0_26px_-4px_rgba(139,92,246,0.65),0_0_40px_-6px_rgba(236,72,153,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]
      active:scale-[0.98]
    `,
    summarize: `
      flex min-h-11 items-center gap-2 rounded-l-full pl-5 pr-3.5 text-[15px]
      font-medium outline-none transition-colors hover:bg-white/10
      active:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/60
      disabled:pointer-events-none disabled:opacity-40
    `,
    divider: 'h-6 w-px bg-white/25',
    trigger: `
      flex min-h-11 items-center rounded-r-full pl-3 pr-4 outline-none
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
