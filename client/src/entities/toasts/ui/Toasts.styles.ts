import { tv } from 'tailwind-variants';

export const toastsStyles = tv({
  slots: {
    root: `
      fixed right-0 top-0 z-(--z-toast)
      flex flex-col items-end justify-start
      gap-3 p-6 pointer-events-none
    `,
    toast: `
      flex items-center p-3 pointer-events-auto
      relative overflow-hidden min-w-[320px]
      rounded-lg transition-all duration-300
    `,
    left: 'flex-1 flex gap-1 items-center',
    title: 'text-sm font-semibold flex-1',
    close: 'flex items-center justify-center h-6 w-6',
  },
  variants: {
    variant: {
      success: {
        toast: 'bg-green-600',
      },
      warning: {
        toast: 'bg-yellow-600',
      },
      info: {
        toast: 'bg-blue-600',
      },
      error: {
        toast: 'bg-red-600',
      },
    },
  },
});
