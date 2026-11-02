import { tv } from 'tailwind-variants';

export const itemListStyles = tv({
  slots: {
    list: 'flex flex-col gap-6',
    rows: `
      flex flex-col divide-y divide-black/5 overflow-hidden rounded-2xl
      border border-gray-200 bg-white
    `,
    empty: `
      flex flex-col items-center gap-1 rounded-2xl border border-dashed
      border-gray-300 px-6 py-16 text-center
    `,
    emptyTitle: 'text-sm font-medium text-gray-600',
  },
});
