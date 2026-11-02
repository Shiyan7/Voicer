import { tv } from 'tailwind-variants';

export const fileInputStyles = tv({
  slots: {
    root: 'flex flex-col gap-2',
    field: `
      flex h-11 cursor-pointer flex-row-reverse items-center justify-between gap-3 bg-white rounded-xl border
      border-dashed px-4 text-[15px] hover:border-gray-500
    `,
    label: 'truncate',
    input: 'hidden',
    error: 'text-[13px] text-red-600',
  },
  variants: {
    filled: {
      true: { field: 'border-gray-500 text-gray-900' },
      false: { field: 'border-gray-300 text-gray-500' },
    },
    invalid: {
      true: { field: 'border-red-500' },
    },
  },
});
