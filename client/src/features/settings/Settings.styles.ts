import { tv } from 'tailwind-variants';

export const settingsStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-2xl flex-col gap-8 p-8',
    pageTitle: 'text-2xl font-semibold tracking-title text-gray-900',
  },
});
