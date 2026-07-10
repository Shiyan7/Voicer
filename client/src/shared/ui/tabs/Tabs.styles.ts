import { tv } from 'tailwind-variants';

export const tabsStyles = tv({
  slots: {
    root: 'flex items-center',
    item: 'relative flex-1',
    btn: `
      py-3 flex items-center justify-center relative w-full
      after:absolute after:w-full after:h-[1px] after:bg-main
      after:bottom-0 after:opacity-0 after:transition-opacity
      transition-colors
    `,
  },
  variants: {
    active: {
      true: {
        btn: 'after:opacity-100 text-main',
      },
      false: {
        btn: 'text-gray',
      },
    },
  },
});
