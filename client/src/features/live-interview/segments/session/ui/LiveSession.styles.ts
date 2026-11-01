import { tv } from 'tailwind-variants';

export const liveSessionStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-4xl flex-col gap-6 py-6',
    bar: `
      sticky top-0 z-10 flex flex-wrap items-center gap-3 rounded-2xl
      border border-gray-200 bg-white/90 px-4 py-3 backdrop-blur
    `,
    timer: 'font-mono text-[18px] font-semibold tabular-nums text-gray-900',
    status: 'flex items-center gap-2 text-[15px] text-gray-600',
    dot: 'size-2.5 rounded-full',
    spacer: 'flex-1',
    list: 'flex flex-col gap-8',
    empty: 'py-16 text-center text-[20px] text-gray-500',
  },
  variants: {
    answering: {
      true: { dot: 'animate-pulse bg-sky-500' },
      false: { dot: 'animate-pulse bg-red-500' },
    },
  },
});
