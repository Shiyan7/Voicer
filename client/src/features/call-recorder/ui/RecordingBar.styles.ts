import { tv } from 'tailwind-variants';

export const recordingBarStyles = tv({
  slots: {
    root: `
      sticky top-0 z-(--z-recording-bar) h-recording-bar opacity-0
      transition-opacity duration-320
    `,
    bar: `
      absolute inset-x-0 bottom-0 grid h-recording-bar-height
      grid-cols-[1fr_auto_1fr] items-center px-3 text-ai-foreground
    `,
    wave: `
      absolute inset-x-0 top-0
      h-[calc(100%+var(--spacing-recording-wave-depth))]
    `,
    time: `
      relative text-[15px] font-semibold tabular-nums
      transition-opacity duration-200
    `,
    action: `
      relative flex size-8 items-center justify-center justify-self-start
      rounded-full transition-[background-color,transform] duration-200
      hover:bg-ai-foreground/20 active:scale-95
    `,
  },
  variants: {
    visible: {
      true: { root: 'opacity-100' },
    },
    paused: {
      true: { time: 'opacity-70' },
    },
  },
});
