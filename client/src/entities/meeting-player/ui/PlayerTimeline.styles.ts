import { tv } from 'tailwind-variants';

export const playerTimelineStyles = tv({
  slots: {
    root: 'grid grid-cols-[3rem_1fr_3rem] items-center gap-3',
    time: 'text-xs tabular-nums text-gray-500',
    timeEnd: 'text-right text-xs tabular-nums text-gray-500',
    track: `
      group relative flex h-5 cursor-pointer touch-none select-none
      items-center
    `,
    rail: 'relative h-1 w-full overflow-hidden rounded-full bg-gray-200',
    fill: 'absolute inset-y-0 left-0 rounded-full bg-gray-900',
    thumb: `
      pointer-events-none absolute top-1/2 size-3.5 -translate-x-1/2
      -translate-y-1/2 rounded-full border-2 border-white bg-gray-900
      shadow-sm transition-transform duration-150 group-hover:scale-110
    `,
  },
});
