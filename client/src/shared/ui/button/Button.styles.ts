import { tv } from 'tailwind-variants';

export const buttonStyles = tv({
  base: `
    relative flex gap-1.5 items-center justify-center
    rounded-full font-medium select-none
    transition-[background-color,color,transform,box-shadow] duration-150
    outline-none focus-visible:ring-2 focus-visible:ring-gray-500/60
    focus-visible:ring-offset-2
    active:scale-[0.98]
    disabled:pointer-events-none disabled:opacity-40
  `,
  variants: {
    variant: {
      primary: 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950',
      secondary:
        'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
      ghost:
        'bg-transparent text-gray-900 hover:bg-gray-900/5 active:bg-gray-900/10',
    },
    size: {
      md: 'min-h-9 px-4 text-sm',
      lg: 'min-h-11 px-5 text-[15px]',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
