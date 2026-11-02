import { tv } from 'tailwind-variants';

export const reviewHeaderStyles = tv({
  slots: {
    root: 'flex min-w-0 items-center gap-4',
    title: 'truncate text-2xl font-semibold tracking-title text-gray-900',
    spacer: 'flex-1',
  },
});
