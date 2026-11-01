import { tv } from 'tailwind-variants';

export const voiceBlobStyles = tv({
  slots: {
    root: 'pointer-events-none relative block',
    layer: `
      absolute inset-0 backdrop-blur-md backdrop-saturate-150
      bg-[color-mix(in_srgb,currentColor_35%,transparent)]
    `,
  },
  variants: {
    outer: {
      true: {
        layer: 'bg-[color-mix(in_srgb,currentColor_18%,transparent)]',
      },
    },
  },
});
