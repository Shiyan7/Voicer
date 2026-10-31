import { tv } from 'tailwind-variants';

export const recordingBarStyles = tv({
  slots: {
    root: `
      fixed bottom-6 left-1/2 z-(--z-toast) -translate-x-1/2
      flex h-16 items-center gap-5 rounded-full bg-white py-2 pl-2 pr-3
      shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06),0_8px_24px_rgb(0_0_0/0.08)]
    `,
    indicator: 'relative flex size-12 shrink-0 items-center justify-center',
    blob: `
      absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      text-red-500
    `,
    mic: `
      relative flex size-12 items-center justify-center rounded-full
      bg-red-500 text-[#fff] transition-colors duration-200
    `,
    time: `
      min-w-16 text-[19px] tabular-nums text-gray-600
      transition-opacity duration-200
    `,
    actions: 'flex items-center gap-2',
  },
  variants: {
    paused: {
      true: { time: 'opacity-50', mic: 'bg-gray-400' },
    },
  },
});
