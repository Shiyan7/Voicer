import { tv } from 'tailwind-variants';

export const searchInputStyles = tv({
  slots: {
    root: 'flex items-center gap-3 py-3 pl-5 pr-14',
    icon: 'shrink-0 text-gray-500',
    input: `
      min-w-0 flex-1 bg-transparent py-2 text-lg text-gray-900
      outline-none placeholder:text-gray-400
    `,
    clear: `
      shrink-0 cursor-pointer rounded-full bg-gray-100 px-3.5 py-1.5 text-sm
      font-medium text-gray-700 transition-colors hover:bg-gray-200
      hover:text-gray-900
    `,
  },
});
