import { tv } from 'tailwind-variants';

export const backHeaderStyles = tv({
  slots: {
    root: 'flex items-center gap-4',
    title: 'text-2xl font-semibold tracking-title text-gray-900',
  },
});
