import { tv } from 'tailwind-variants';

export const statsStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-5xl flex-col gap-5 py-6',
    title: 'text-2xl font-semibold tracking-title text-gray-900',
    error: 'rounded-2xl bg-gray-100 px-6 py-10 text-center text-sm text-gray-500',
  },
});
