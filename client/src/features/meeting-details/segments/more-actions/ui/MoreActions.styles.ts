import { tv } from 'tailwind-variants';

export const moreActionsStyles = tv({
  slots: {
    trigger: `
      flex size-11 items-center justify-center rounded-full border
      border-gray-200 bg-white text-gray-900 outline-none transition
      hover:bg-gray-100 active:scale-[0.96] active:bg-gray-200
      focus-visible:ring-2 focus-visible:ring-gray-300
    `,
  },
});
