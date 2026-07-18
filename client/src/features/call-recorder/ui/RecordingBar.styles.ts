import { tv } from 'tailwind-variants';

export const recordingBarStyles = tv({
  slots: {
    root: `
      fixed bottom-6 left-1/2 z-(--z-toast) -translate-x-1/2
      flex items-center gap-3 py-2 pl-4 pr-2
      overflow-hidden rounded-full
      bg-gray-900/90 backdrop-blur-xl text-white
    `,
    dot: 'size-2 shrink-0 animate-pulse rounded-full bg-red-500',
    text: 'text-sm font-medium',
    time: 'text-sm tabular-nums text-white/70',
    stop: `
      bg-white text-gray-900
      hover:bg-gray-100 active:bg-gray-200
    `,
    progress: 'absolute inset-x-0 bottom-0 h-0.5 animate-pulse bg-white/60',
  },
  variants: {
    uploading: {
      true: {
        dot: 'animate-none bg-white/60',
      },
    },
  },
});
