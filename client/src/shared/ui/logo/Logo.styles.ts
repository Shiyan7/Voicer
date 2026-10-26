import { tv } from 'tailwind-variants';

export const logoStyles = tv({
  slots: {
    root: 'flex items-center gap-2.5 select-none',
    mark: `
      relative flex size-9 shrink-0 items-center justify-center rounded-[11px]
      bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_45%,#ec4899_100%)]
      shadow-[0_4px_14px_-4px_rgba(139,92,246,0.7),inset_0_1px_0_rgba(255,255,255,0.35)]
    `,
    bars: 'size-5 text-white',
    word: `
      text-[19px] font-bold tracking-[-0.03em] text-gray-900
    `,
    dot: 'text-[#ec4899]',
  },
});
