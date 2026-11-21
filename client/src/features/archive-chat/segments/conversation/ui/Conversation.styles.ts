import { tv } from 'tailwind-variants';

export const conversationStyles = tv({
  slots: {
    root: 'flex min-w-0 flex-1 flex-col bg-white',
    body: `
      flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain
      [scrollbar-gutter:stable_both-edges]
    `,
    feed: 'mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-8',
    title: `
      mt-auto animate-message-in px-6 pb-8 text-center text-[32px]
      font-semibold tracking-title text-gray-900
    `,
    footer: 'mx-auto w-full max-w-3xl px-6 pb-5 pt-2',
    spacer: 'shrink-0 grow-[0.0001] basis-0',
  },
  variants: {
    empty: {
      true: { spacer: 'grow' },
    },
    animated: {
      true: {
        spacer: `
          transition-[flex-grow] duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]
        `,
      },
    },
  },
});
