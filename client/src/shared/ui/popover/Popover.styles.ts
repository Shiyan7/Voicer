import { tv } from 'tailwind-variants';

export const popoverStyles = tv({
  slots: {
    root: 'relative inline-flex',
    panel: 'absolute z-50 rounded-2xl border border-gray-200 bg-white',
  },
  variants: {
    placement: {
      'top-start': {
        panel: 'bottom-[calc(100%+23px)] -left-1.5',
      },
      'bottom-end': {
        panel: '-right-1.5 top-[calc(100%+23px)]',
      },
    },
  },
  defaultVariants: {
    placement: 'bottom-end',
  },
});
