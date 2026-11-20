import { tv } from 'tailwind-variants';

export const conversationStyles = tv({
  slots: {
    root: 'flex min-w-0 flex-1 flex-col bg-white',
    body: 'flex-1 overflow-y-auto overscroll-contain',
    feed: 'mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-8',
    intro: 'flex flex-col items-start gap-3 pt-[12vh]',
    introIcon: `
      flex size-10 items-center justify-center rounded-full frost-surface
    `,
    introTitle: 'text-2xl font-semibold tracking-title text-gray-900',
    introHint: 'max-w-lg text-[15px] leading-relaxed text-gray-500',
    examples: 'items-start pt-2',
    footer: 'mx-auto w-full max-w-3xl px-6 pb-5 pt-2',
  },
});
