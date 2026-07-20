import { tv } from 'tailwind-variants';

export const generalStyles = tv({
  slots: {
    select: `
      rounded-lg border border-gray-300
      bg-white px-3 py-2 text-sm text-gray-900
    `,
    logoutRow: 'flex justify-center px-5 py-4',
    logout: `
      inline-flex items-center gap-1.5
      rounded-lg px-4 py-2 text-[15px] font-medium text-critical
      transition-colors hover:bg-critical/10
    `,
  },
});
