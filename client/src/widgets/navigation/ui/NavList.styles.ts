import { tv } from 'tailwind-variants';

export const navListStyles = tv({
  slots: {
    root: 'mb-5 mt-7 flex flex-col gap-1',
    item: `
      text-md flex w-full items-center
      p-1 px-2 font-medium rounded-lg text-gray-900
      hover:bg-gray-200 cursor-pointer transition-colors
      data-[current=true]:bg-gray-200
      data-[current=false]:active:bg-gray-300
    `,
    itemIcon: 'mr-1 h-5 w-5',
    separator: `
      mb-1 mt-3 block px-2
      text-[12px] font-bold text-gray-500
    `,
  },
});
