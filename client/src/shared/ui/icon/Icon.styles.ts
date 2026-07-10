import { tv } from 'tailwind-variants';

export const iconStyles = tv({
  base: 'select-none fill-current inline-block text-inherit box-content align-[-0.125em]',
  variants: {
    axis: {
      square: 'w-(--icon-size) h-(--icon-size)',
      x: 'w-(--icon-size)',
      y: 'h-(--icon-size)',
    },
  },
  defaultVariants: {
    axis: 'square',
  },
});
