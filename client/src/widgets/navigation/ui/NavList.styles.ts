import { tv } from 'tailwind-variants';

export const navListStyles = tv({
  slots: {
    root: 'mt-6 flex flex-col gap-2',
    item: `
      flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5
      text-[16px] font-medium text-gray-900
      hover:bg-gray-200 cursor-pointer transition-colors
    `,
    itemIcon: 'size-[20px] shrink-0',
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
