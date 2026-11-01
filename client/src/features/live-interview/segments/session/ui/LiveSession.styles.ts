import { tv } from 'tailwind-variants';

export const liveSessionStyles = tv({
  slots: {
    root: 'flex min-h-[calc(100dvh-1rem)] flex-col',
    column: `
      mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6
      pt-6
    `,
    header: 'flex min-w-0 items-center gap-4',
    title: 'truncate text-2xl font-semibold tracking-title text-gray-900',
    bar: `
      sticky top-4 z-10 flex flex-wrap items-center gap-3 rounded-2xl
      border border-gray-200 bg-white/90 px-4 py-3 backdrop-blur
    `,
    timer: 'font-mono text-[18px] font-semibold tabular-nums text-gray-900',
    status: 'flex items-center gap-2 text-[15px] text-gray-600',
    dot: 'size-2.5 rounded-full',
    spacer: 'flex-1',
    list: 'flex min-w-0 flex-col gap-8 pb-25',
    toBottom: `
      sticky bottom-10 flex size-10 items-center self-center
      justify-center rounded-full border border-gray-300 bg-white
      text-gray-900 shadow-lg transition-colors hover:bg-gray-100
    `,
    toBottomIcon: 'rotate-180',
    empty: 'py-16 text-center text-[20px] text-gray-500',
  },
  variants: {
    answering: {
      true: { dot: 'animate-pulse bg-sky-500' },
      false: { dot: 'animate-pulse bg-red-500' },
    },
  },
});
