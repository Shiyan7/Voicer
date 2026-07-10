import { tv } from 'tailwind-variants';

export const inputStyles = tv({
  slots: {
    root: 'flex flex-col gap-1',
    input: `
      w-full h-10 rounded-md border bg-white px-3.5
      text-gray-900 placeholder:text-gray-500 outline-none text-sm
      focus:border-blue-500 focus:ring-1 focus:ring-blue-500
    `,
    label: 'block text-sm text-gray-700',
    error: 'text-red-500 text-xs',
  },
  variants: {
    error: {
      true: {
        input: 'border-red-500',
      },
      false: {
        input: 'border-gray-300',
      },
    },
  },
});
