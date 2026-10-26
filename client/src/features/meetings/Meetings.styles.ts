import { tv } from 'tailwind-variants';

export const meetingsStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-5xl flex-col gap-6 py-6',
    header: 'flex items-center justify-between gap-4',
    section: 'flex flex-col gap-3',
    title: 'text-2xl font-semibold tracking-title text-gray-900',
  },
});
