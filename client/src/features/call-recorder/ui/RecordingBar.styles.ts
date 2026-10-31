import { tv } from 'tailwind-variants';

export const recordingBarStyles = tv({
  slots: {
    root: 'fixed bottom-6 left-1/2 z-(--z-toast) -translate-x-1/2',
    pill: `
      flex h-14 items-center gap-4 bg-white py-2 pl-5 pr-2
      shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06),0_8px_24px_rgb(0_0_0/0.08)]
    `,
    mic: 'relative z-[5] shrink-0 text-gray-600',
    time: `
      relative z-[5] min-w-14 text-[17px] tabular-nums text-gray-600
      transition-opacity duration-200
    `,
    actions: 'relative z-[5] flex items-center gap-1.5',
    control: `
      relative isolate flex size-10 shrink-0 items-center justify-center
      rounded-full border border-transparent text-gray-900
      [background:linear-gradient(180deg,color-mix(in_srgb,var(--color-white)_90%,transparent),color-mix(in_srgb,var(--color-white)_25%,transparent))_padding-box,linear-gradient(180deg,color-mix(in_srgb,var(--color-black)_9%,transparent),transparent_65%)_border-box]
      transition-[color,transform] duration-200 active:scale-95
      before:absolute before:-inset-px before:-z-10 before:rounded-full
      before:bg-gray-900 before:opacity-0 before:transition-opacity
      before:duration-200 hover:text-white hover:before:opacity-100
    `,
  },
  variants: {
    paused: {
      true: { time: 'opacity-50' },
    },
  },
});
