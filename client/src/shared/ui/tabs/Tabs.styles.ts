import { tv } from 'tailwind-variants';

export const tabsStyles = tv({
  slots: {
    root: 'flex items-center gap-6 border-b border-gray-200',
    item: 'relative',
    btn: `
      relative flex items-center justify-center px-1 py-3 text-sm font-medium
      -mb-px border-b-2 border-transparent outline-none
      transition-colors duration-200
    `,
  },
  variants: {
    active: {
      true: {
        btn: 'border-gray-900 text-gray-900',
      },
      false: {
        btn: 'text-gray-500 hover:text-gray-900',
      },
    },
  },
});
