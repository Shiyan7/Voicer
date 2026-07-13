import { tv } from 'tailwind-variants';

export const actionItemStyles = tv({
  slots: {
    row: 'flex items-start gap-3',
    checkbox: `
      mt-0.5 flex size-5 shrink-0 cursor-pointer items-center justify-center
      rounded-full border border-gray-300 bg-transparent text-white
      transition-colors duration-150 outline-none
      hover:border-gray-500
      focus-visible:ring-2 focus-visible:ring-gray-500/60 focus-visible:ring-offset-1
    `,
    text: 'text-sm leading-6 text-gray-800 transition-colors duration-150',
  },
  variants: {
    done: {
      true: {
        checkbox: 'border-gray-900 bg-gray-900',
        text: 'text-gray-400 line-through',
      },
    },
  },
});
