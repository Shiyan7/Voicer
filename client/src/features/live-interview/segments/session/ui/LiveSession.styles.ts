import { tv } from 'tailwind-variants';

export const liveSessionStyles = tv({
  slots: {
    recordingLink:
      'text-[14px] font-medium text-gray-900 underline-offset-4 hover:underline',
    root: 'relative mx-auto flex h-[calc(100dvh-1rem)] w-full max-w-4xl flex-col gap-6 py-6',
    bar: `
      flex flex-wrap items-center gap-3 rounded-2xl
      border border-gray-200 bg-white/90 px-4 py-3 backdrop-blur
    `,
    timer: 'font-mono text-[18px] font-semibold tabular-nums text-gray-900',
    status: 'flex items-center gap-2 text-[15px] text-gray-600',
    dot: 'size-2.5 rounded-full',
    spacer: 'flex-1',
    scroller: 'flex min-h-0 flex-1 flex-col-reverse overflow-y-auto',
    list: 'flex flex-col gap-8 pb-4',
    toBottom: `
      absolute bottom-10 left-1/2 flex size-10 -translate-x-1/2 items-center
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
