import { tv } from 'tailwind-variants';

export const toastsStyles = tv({
  slots: {
    root: `
      fixed right-0 top-0 z-(--z-toast)
      flex flex-col items-end justify-start
      gap-3 p-6 pointer-events-none
    `,
    toast: `
      flex items-center gap-2 px-4 py-3 pointer-events-auto
      relative overflow-hidden min-w-[320px]
      rounded-xl border border-black/5
      bg-white/85 backdrop-blur-xl text-gray-900
      shadow-lg transition-all duration-300
    `,
    left: `
      flex-1 flex gap-2.5 items-center
      before:size-2 before:shrink-0 before:rounded-full
    `,
    title: 'text-sm font-medium flex-1 text-gray-900',
    close: `
      flex items-center justify-center h-6 w-6
      rounded-full text-gray-400 transition-colors
      hover:bg-gray-900/5 hover:text-gray-900
    `,
  },
  variants: {
    variant: {
      success: {
        left: 'before:bg-green-500',
      },
      warning: {
        left: 'before:bg-amber-500',
      },
      info: {
        left: 'before:bg-gray-500',
      },
      error: {
        left: 'before:bg-red-500',
      },
    },
  },
});
