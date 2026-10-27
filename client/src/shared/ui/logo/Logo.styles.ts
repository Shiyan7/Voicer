import { tv } from 'tailwind-variants';

export const logoStyles = tv({
  slots: {
    root: 'flex items-center gap-3 select-none',
    mark: `
      relative flex size-11 shrink-0 items-center justify-center rounded-[13px]
      bg-linear-to-b from-logo-from to-logo-to
    `,
    bars: 'size-6',
    word: 'text-[22px] font-bold tracking-[-0.03em] text-gray-900',
  },
});
