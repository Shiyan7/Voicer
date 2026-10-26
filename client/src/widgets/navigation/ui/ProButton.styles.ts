import { tv } from 'tailwind-variants';

export const proButtonStyles = tv({
  slots: {
    root: `
      group relative mt-2 flex w-full cursor-pointer items-center gap-2.5
      overflow-hidden rounded-xl px-3 py-2.5 text-left
      bg-[linear-gradient(110deg,#f59e0b,#fde68a,#fbbf24,#f59e0b)]
      bg-size-[250%_100%] animate-ai-flow
      shadow-[0_6px_20px_-6px_rgba(245,158,11,0.75),inset_0_1px_0_rgba(255,255,255,0.6)]
      transition-transform duration-200
      active:scale-[0.98]
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70
    `,
    iconWrap: `
      relative flex size-8 shrink-0 items-center justify-center rounded-lg
      bg-[rgba(255,255,255,0.4)] text-amber-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]
      transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110
    `,
    text: 'relative flex min-w-0 flex-col',
    title: 'text-[15px] font-bold leading-5 text-amber-950',
    hint: 'truncate text-[12px] font-medium leading-4 text-amber-900/75',
  },
  variants: {
    collapsed: {
      true: {
        root: 'size-11 justify-center p-0',
        iconWrap: 'bg-transparent shadow-none',
      },
    },
  },
});
