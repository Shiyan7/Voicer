import { tv } from 'tailwind-variants';

export const reviewHeaderStyles = tv({
  slots: {
    root: 'sticky top-0 z-10 -my-3 flex min-w-0 items-center gap-4 bg-gray-50 py-3',
    title: 'truncate text-2xl font-semibold tracking-title text-gray-900',
    spacer: 'flex-1',
  },
});
