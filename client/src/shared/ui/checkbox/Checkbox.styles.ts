import { tv } from 'tailwind-variants';

export const checkboxStyles = tv({
  slots: {
    root: `
      flex cursor-pointer items-center gap-2 text-sm font-medium
      text-gray-800 select-none
    `,
    input: 'peer sr-only',
    box: `
      flex size-[18px] shrink-0 items-center justify-center rounded-[5px]
      border border-gray-300 bg-white text-transparent
      transition-colors duration-150
      peer-focus-visible:ring-2 peer-focus-visible:ring-gray-300
    `,
  },
  variants: {
    checked: {
      true: {
        box: 'border-gray-900 bg-gray-900 text-white',
      },
    },
  },
});
