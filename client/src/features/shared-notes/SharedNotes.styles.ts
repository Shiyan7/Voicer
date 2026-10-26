import { tv } from 'tailwind-variants';

export const sharedNotesStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-3xl flex-col gap-6 py-6',
    title: 'text-2xl font-semibold tracking-title text-gray-900',
    empty: `
      flex flex-col items-center gap-2 rounded-2xl border-[0.5px]
      border-gray-200 bg-white px-6 py-14 text-center
    `,
    emptyIcon: `
      mb-1 flex size-12 items-center justify-center rounded-2xl bg-gray-100
      text-gray-500
    `,
    emptyTitle: 'text-[15px] font-semibold text-gray-900',
    emptyHint: 'max-w-sm text-sm text-gray-500',
  },
});
