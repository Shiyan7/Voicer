import { tv } from 'tailwind-variants';

export const actionsListStyles = tv({
  slots: {
    groups: 'flex flex-col gap-5',
    empty: `
      flex flex-col items-center gap-1 rounded-2xl border border-dashed
      border-gray-300 px-6 py-16 text-center
    `,
    emptyTitle: 'text-sm font-medium text-gray-600',
    skeleton: 'h-32 animate-pulse rounded-2xl bg-gray-100',
  },
});
