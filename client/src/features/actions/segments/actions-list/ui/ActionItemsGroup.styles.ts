import { tv } from 'tailwind-variants';

export const actionItemsGroupStyles = tv({
  slots: {
    group: 'flex flex-col gap-2',
    groupHeader: 'flex items-baseline justify-between gap-3 px-1',
    groupTitle: 'truncate text-sm font-semibold text-gray-900',
    groupLink: `
      shrink-0 text-[13px] font-medium text-gray-500
      transition-colors duration-150 hover:text-gray-900
    `,
    card: `
      flex flex-col divide-y divide-gray-100 rounded-2xl
      border border-black/5 bg-white px-5 shadow-xs
    `,
    row: 'flex items-start gap-3 py-3.5',
    checkbox: `
      mt-0.5 flex size-5 shrink-0 cursor-pointer items-center justify-center
      rounded-full border border-gray-300 bg-transparent text-white
      transition-colors duration-150 outline-none
      hover:border-gray-500
      focus-visible:ring-2 focus-visible:ring-gray-500/60 focus-visible:ring-offset-1
    `,
    rowText: 'text-sm leading-6 text-gray-800 transition-colors duration-150',
  },
  variants: {
    done: {
      true: {
        checkbox: 'border-gray-900 bg-gray-900',
        rowText: 'text-gray-400 line-through',
      },
    },
  },
});
