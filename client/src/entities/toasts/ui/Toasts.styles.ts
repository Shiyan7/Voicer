import { tv } from 'tailwind-variants';

export const toastsStyles = tv({
  slots: {
    root: `
      fixed inset-x-0 bottom-0 z-(--z-toast)
      flex flex-col items-center justify-end
      gap-2 p-6 pointer-events-none
    `,
    toast: `
      flex items-center gap-3 py-2 pl-2 pr-2 pointer-events-auto
      relative overflow-hidden
      rounded-2xl border border-black/5
      bg-white/90 backdrop-blur-xl text-gray-900
      shadow-[0_12px_32px_-12px_rgba(15,15,30,0.3)]
      animate-toast-in
    `,
    badge: `
      flex size-8 shrink-0 items-center justify-center rounded-xl text-white
    `,
    title: 'flex-1 pr-2 text-sm font-medium text-gray-900',
    close: `
      flex items-center justify-center h-6 w-6
      rounded-full text-gray-400 transition-colors
      hover:bg-gray-900/5 hover:text-gray-900
    `,
  },
  variants: {
    variant: {
      success: {
        badge: 'bg-emerald-500',
      },
      warning: {
        badge: 'bg-amber-500',
      },
      info: {
        badge: 'bg-gray-500',
      },
      error: {
        badge: 'bg-red-500',
      },
    },
  },
});
