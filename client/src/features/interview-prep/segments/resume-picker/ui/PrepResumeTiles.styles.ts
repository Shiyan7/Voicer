import { tv } from 'tailwind-variants';

export const prepResumeTilesStyles = tv({
  slots: {
    root: 'flex flex-wrap gap-2',
    tile: `
      flex max-w-64 items-center gap-1 rounded-xl border bg-white p-2
      text-[13px] text-gray-800 transition-colors duration-200
    `,
    select: 'flex min-w-0 cursor-pointer items-center gap-2.5 text-left',
    remove: `
      flex size-6 shrink-0 cursor-pointer items-center justify-center
      rounded-md text-gray-400 transition-colors hover:bg-gray-100
      hover:text-gray-700
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
