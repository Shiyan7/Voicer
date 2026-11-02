import { tv } from 'tailwind-variants';

export const liveSessionStyles = tv({
  slots: {
    root: 'flex min-h-[calc(100dvh-1rem)] flex-col',
    column: `
      mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6
      pt-6
    `,
    list: 'flex min-w-0 flex-col gap-8 pb-25',
    toBottom: `
      sticky bottom-10 flex size-10 items-center self-center
      justify-center rounded-full border border-gray-300 bg-white
      text-gray-900 shadow-lg transition-colors hover:bg-gray-100
    `,
    toBottomIcon: 'rotate-180',
    empty: 'py-16 text-center text-[20px] text-gray-500',
  },
});
