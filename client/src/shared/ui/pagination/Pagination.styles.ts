import { tv } from 'tailwind-variants';

export const paginationStyles = tv({
  slots: {
    root: 'flex justify-center pt-2',
    group: `
      inline-flex items-center gap-1 rounded-full border-[0.5px]
      border-gray-200 bg-white p-1
    `,
    button: `
      flex size-8 items-center justify-center rounded-full text-gray-700
      transition-colors hover:bg-gray-200/60 hover:text-gray-900
      disabled:pointer-events-none disabled:text-gray-300
      focus-visible:ring-2 focus-visible:ring-gray-500/60
    `,
    page: 'min-w-16 px-2 text-center text-sm font-medium text-gray-600 tabular-nums',
  },
});
