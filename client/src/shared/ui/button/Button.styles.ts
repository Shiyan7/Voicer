import { tv } from 'tailwind-variants';

export const buttonStyles = tv({
  base: `
    relative flex gap-1 items-center justify-center
    rounded-xl text-sm font-semibold
    active:scale-[0.99] transition-all
  `,
  variants: {
    variant: {
      primary: 'bg-main text-text hover:bg-main-hover',
      secondary: 'bg-white/15 text-white hover:bg-white/25',
    },
    size: {
      md: 'h-11 px-5',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
