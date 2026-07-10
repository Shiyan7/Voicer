import { tv } from 'tailwind-variants';

export const headerStyles = tv({
  slots: {
    container: 'flex items-center justify-between py-3 px-4 sm:px-5',
    logo: 'block p-3',
    right: 'flex items-center gap-3',
    select: 'cursor-pointer',
  },
});
