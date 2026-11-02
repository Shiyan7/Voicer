import { tv } from 'tailwind-variants';

export const backButtonStyles = tv({
  base: `
    flex size-9 shrink-0 items-center justify-center rounded-xl border
    border-gray-200 bg-white text-gray-700 outline-none
    transition-[background-color,color,transform] duration-150
    hover:bg-gray-100 hover:text-gray-900 active:scale-95
    focus-visible:ring-2 focus-visible:ring-gray-300
  `,
});
