import { tv } from 'tailwind-variants';

export const prepResumeTilesStyles = tv({
  slots: {
    root: 'flex flex-wrap gap-2',
    tile: `
      flex max-w-56 cursor-pointer items-center gap-2.5 rounded-xl border-2
      bg-white p-2 pr-3 text-left text-[13px] text-gray-800 transition-colors
      duration-200
    `,
    badge: `
      flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-400
      text-[11px] font-semibold text-white
    `,
    name: 'truncate',
  },
  variants: {
    selected: {
      true: { tile: 'border-gray-900' },
      false: { tile: 'border-gray-200 hover:border-gray-400' },
    },
  },
});
