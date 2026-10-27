import { tv } from 'tailwind-variants';

export const statsStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-5xl flex-col gap-5 py-6',
    title: 'text-2xl font-semibold tracking-title text-gray-900',
  },
});
