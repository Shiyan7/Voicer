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
      border border-black/5 bg-white px-5 py-2
    `,
  },
});
