import { tv } from 'tailwind-variants';

export const appLayoutStyles = tv({
  slots: {
    root: 'grid min-h-screen grid-cols-[auto_1fr]',
    main: 'bg-gray-50',
  },
});
