import { tv } from 'tailwind-variants';

export const chatMessageStyles = tv({
  slots: {
    user: `
      max-w-[85%] self-end whitespace-pre-wrap rounded-2xl rounded-br-md
      bg-gray-100 px-4 py-2.5 text-[15px] leading-relaxed text-gray-900
    `,
    assistant: `
      flex flex-col gap-2 text-[15px] leading-relaxed
      text-gray-900
    `,
    failed: 'text-[14px] text-critical',
    actions: 'flex items-center gap-1',
    action: `
      flex size-8 items-center justify-center rounded-full text-gray-500
      transition-colors hover:bg-gray-100 hover:text-gray-900
    `,
  },
  variants: {
    live: {
      true: {
        user: 'animate-message-in',
        assistant: 'animate-message-in',
      },
    },
  },
});
