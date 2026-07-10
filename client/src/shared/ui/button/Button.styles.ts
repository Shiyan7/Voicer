import { tv } from 'tailwind-variants';

export const buttonStyles = tv({
  base: `
    relative flex gap-1 items-center justify-center
    rounded-md text-sm font-medium
    transition-colors active:scale-[0.99]
  `,
  variants: {
    variant: {
      primary:
        'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    },
    size: {
      md: 'min-h-8 px-3',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
