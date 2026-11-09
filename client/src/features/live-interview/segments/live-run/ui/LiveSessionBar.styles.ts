import { tv } from 'tailwind-variants';

export const liveSessionBarStyles = tv({
  slots: {
    root: `
      sticky top-4 z-10 flex flex-wrap items-center gap-3 rounded-2xl
      border border-gray-200 bg-white/90 px-4 py-3 backdrop-blur
    `,
    timer: 'font-mono text-[18px] font-semibold tabular-nums text-gray-900',
    status: 'flex items-center gap-2 text-[15px] text-gray-600',
    dot: 'size-2.5 rounded-full',
    spacer: 'flex-1',
  },
  variants: {
    answering: {
      true: { dot: 'animate-pulse bg-sky-500' },
      false: { dot: 'animate-pulse bg-red-500' },
    },
  },
});
