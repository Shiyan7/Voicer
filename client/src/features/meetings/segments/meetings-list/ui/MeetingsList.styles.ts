import { tv } from 'tailwind-variants';

export const meetingsListStyles = tv({
  slots: {
    list: 'flex flex-col gap-3',
    empty: `
      flex flex-col items-center gap-1 rounded-2xl border border-dashed
      border-gray-300 px-6 py-16 text-center
    `,
    emptyTitle: 'text-sm font-medium text-gray-600',
  },
});
