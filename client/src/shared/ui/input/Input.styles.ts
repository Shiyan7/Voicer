import { tv } from 'tailwind-variants';

export const inputStyles = tv({
  slots: {
    root: 'flex flex-col gap-1.5',
    input: `
      w-full h-11 rounded-lg border bg-white px-3.5
      text-[15px] text-gray-900 placeholder:text-gray-500 outline-none
      transition-[border-color,box-shadow] duration-150
      focus:border-gray-500 focus:ring-[3px] focus:ring-gray-900/10
    `,
    label: 'block text-[13px] font-medium text-gray-600',
    error: 'text-red-500 text-xs',
  },
  variants: {
    error: {
      true: {
        input: 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
      },
      false: {
        input: 'border-gray-300',
      },
    },
  },
});
