import { tv } from 'tailwind-variants';

export const glassIconButtonStyles = tv({
  base: `
    relative isolate flex shrink-0 items-center justify-center
    rounded-full border border-transparent text-gray-900
    [background:linear-gradient(180deg,color-mix(in_srgb,var(--color-white)_90%,transparent),color-mix(in_srgb,var(--color-white)_25%,transparent))_padding-box,linear-gradient(180deg,color-mix(in_srgb,var(--color-black)_9%,transparent),transparent_65%)_border-box]
    transition-[color,transform] duration-200 active:scale-95
    before:absolute before:-inset-px before:-z-10 before:rounded-full
    before:bg-gray-900 before:opacity-0 before:transition-opacity
    before:duration-200 enabled:hover:text-white
    enabled:hover:before:opacity-100 disabled:text-gray-400
  `,
  variants: {
    size: {
      sm: 'size-9',
      md: 'size-10',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
