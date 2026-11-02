import { tv } from 'tailwind-variants';

export const fileInputStyles = tv({
  slots: {
    root: `
      flex cursor-pointer items-center justify-between gap-3
      rounded-xl border border-dashed border-gray-200 bg-white px-4 py-3
      text-[15px] text-gray-500 transition-colors hover:border-gray-500
    `,
    label: 'truncate',
    input: 'hidden',
  },
  variants: {
    filled: {
      true: { root: 'border-gray-500 text-gray-900' },
    },
  },
});
