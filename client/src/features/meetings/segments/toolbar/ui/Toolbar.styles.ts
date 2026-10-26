import { tv } from 'tailwind-variants';

export const toolbarStyles = tv({
  slots: {
    root: 'flex items-center gap-0.5 rounded-full bg-gray-200 p-1',
    action: `
      flex h-9 min-w-11 cursor-pointer items-center justify-center gap-2
      rounded-full px-4 text-sm font-medium text-gray-700 transition-colors
      hover:bg-gray-300 hover:text-gray-900 active:scale-[0.98]
      focus-visible:ring-2 focus-visible:ring-gray-500/60
    `,
    uploadInput: 'hidden',
  },
  variants: {
    busy: {
      true: { action: 'pointer-events-none opacity-60' },
    },
  },
});
