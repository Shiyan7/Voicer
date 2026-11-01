import { tv } from 'tailwind-variants';

export const meetingsListStyles = tv({
  slots: {
    emptyAction: 'mt-3',
    deleteBtn: `
      flex size-8 cursor-pointer items-center justify-center rounded-lg text-gray-400
      transition-colors hover:bg-red-50 hover:text-red-600
      focus-visible:ring-2 focus-visible:ring-red-500/60
    `,
  },
});
