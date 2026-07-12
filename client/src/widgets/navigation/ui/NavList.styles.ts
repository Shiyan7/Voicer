import { tv } from 'tailwind-variants';

export const navListStyles = tv({
  slots: {
    root: 'mb-5 mt-7 flex flex-col gap-1',
    item: `
      text-sm flex gap-1 w-full items-center
      p-1 px-2 font-medium rounded-lg text-gray-900
      hover:bg-gray-200 cursor-pointer transition-colors
    `,
    itemIcon: 'size-4',
  },
  variants: {
    current: {
      true: {
        item: 'bg-gray-200',
      },
      false: {
        item: 'active:bg-gray-300',
      },
    },
  },
});
