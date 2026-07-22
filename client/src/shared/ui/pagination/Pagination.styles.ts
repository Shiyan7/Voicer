import { tv } from 'tailwind-variants';

export const paginationStyles = tv({
  slots: {
    root: 'flex items-center justify-center gap-2 pt-2',
    button: `
      inline-flex items-center gap-1 rounded-full px-4 py-2 text-[15px]
      font-medium text-gray-900 bg-gray-100 transition-colors duration-150
      hover:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-100
    `,
    page: `
      flex size-9 items-center justify-center rounded-lg border-[1.5px] border-gray-300
      bg-gray-50 text-[15px] font-semibold text-gray-900
    `,
  },
});
