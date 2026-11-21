import { tv } from 'tailwind-variants';

export const recordingBarStyles = tv({
  slots: {
    root: `
      fixed right-6 top-1/2 z-(--z-toast) -translate-y-1/2
      flex w-16 flex-col items-center gap-3 rounded-full bg-white px-2 pb-2
      pt-2
      shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06),0_8px_24px_rgb(0_0_0/0.08)]
    `,
    indicator: 'relative flex size-12 shrink-0 items-center justify-center',
    blob: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    mic: `
      relative flex size-12 items-center justify-center rounded-full
      bg-gray-950 text-[#fff]
    `,
    time: `
      text-[14px] font-medium tabular-nums text-gray-600
      transition-opacity duration-200
    `,
    actions: 'flex flex-col items-center gap-2',
  },
  variants: {
    paused: {
      true: { time: 'opacity-50' },
    },
  },
});
