import { tv } from 'tailwind-variants';

export const mainLayoutStyles = tv({
  slots: {
    root: 'grid min-h-screen grid-cols-[auto_1fr]',
    main: 'bg-neutral-50',
  },
});
