import { tv } from 'tailwind-variants';

export const actionsStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-3xl flex-col gap-6 py-6',
    header: 'flex items-center justify-between gap-4',
    title: 'text-2xl font-semibold tracking-title text-gray-900',
    tabs: 'w-56 shrink-0',
  },
});
