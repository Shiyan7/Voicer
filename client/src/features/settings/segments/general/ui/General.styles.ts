import { tv } from 'tailwind-variants';

export const generalStyles = tv({
  slots: {
    select: `
      rounded-lg border border-gray-300
      bg-white px-3 py-2 text-sm text-gray-900
    `,
    logout:
      'px-5 py-4 text-[15px] text-red-600 transition-colors hover:bg-gray-50',
  },
});
