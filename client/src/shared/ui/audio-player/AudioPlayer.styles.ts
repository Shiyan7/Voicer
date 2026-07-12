import { tv } from 'tailwind-variants';

export const audioPlayerStyles = tv({
  slots: {
    root: `
      flex items-center gap-4 rounded-2xl border border-black/5
      bg-white px-4 py-3 shadow-xs
    `,
    playBtn: `
      flex size-10 shrink-0 items-center justify-center rounded-full
      bg-gray-900 text-white outline-none
      transition-[background-color,transform] duration-150
      hover:bg-gray-800 active:scale-95
      focus-visible:ring-2 focus-visible:ring-gray-500/60 focus-visible:ring-offset-2
      disabled:pointer-events-none disabled:opacity-40
    `,
    playIcon: 'size-4 fill-current',
    time: 'w-11 shrink-0 text-center text-xs tabular-nums text-gray-500',
    track: `
      group relative flex h-7 min-w-0 flex-1 cursor-pointer
      touch-none items-center select-none
    `,
    trackRail: 'relative h-1 w-full overflow-hidden rounded-full bg-gray-200',
    trackFill: 'absolute inset-y-0 left-0 rounded-full bg-gray-900',
    thumb: `
      pointer-events-none absolute top-1/2 size-3 -translate-x-1/2
      -translate-y-1/2 rounded-full bg-gray-900 opacity-0 shadow-sm
      transition-opacity duration-150 group-hover:opacity-100
    `,
    rateBtn: `
      shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium
      tabular-nums text-gray-600 outline-none
      transition-colors duration-150 hover:bg-gray-200 hover:text-gray-900
      focus-visible:ring-2 focus-visible:ring-gray-500/60
    `,
    message: 'flex-1 truncate text-sm text-gray-500',
  },
  variants: {
    dragging: {
      true: {
        thumb: 'opacity-100',
      },
    },
  },
});
