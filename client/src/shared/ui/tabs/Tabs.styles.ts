import { tv } from 'tailwind-variants';

export const tabsStyles = tv({
  slots: {
    root: 'flex items-center gap-1 rounded-full bg-gray-100 p-1',
    item: 'relative flex-1',
    btn: `
      relative flex w-full items-center justify-center
      rounded-full px-4 py-2 text-sm font-medium
      outline-none focus-visible:ring-2 focus-visible:ring-gray-500/60
      transition-colors duration-200
    `,
  },
  variants: {
    active: {
      true: {
        btn: 'bg-gray-900 text-white',
      },
      false: {
        btn: 'text-gray-600 hover:text-gray-900',
      },
    },
  },
});
