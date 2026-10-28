import { tv } from 'tailwind-variants';

export const chatMessageStyles = tv({
  slots: {
    user: `
      max-w-[85%] self-end whitespace-pre-wrap rounded-2xl rounded-br-md
      bg-gray-100 px-4 py-2.5 text-[15px] leading-relaxed text-gray-900
    `,
    assistant: 'flex flex-col gap-2 text-[15px] leading-relaxed text-gray-900',
    block: '',
    bold: 'font-semibold',
    code: `
      rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-[13px] text-gray-800
    `,
    time: `
      mx-0.5 inline-flex items-center gap-1 rounded-md bg-gray-100 px-1.5
      align-[0.05em] text-[12px] font-medium leading-5 text-gray-600
      tabular-nums transition-colors hover:bg-gray-200 hover:text-gray-900
    `,
    failed: 'text-[14px] text-critical',
  },
  variants: {
    bullet: {
      true: {
        block: `
          relative pl-4 before:absolute before:left-1 before:top-[0.7em]
          before:size-1 before:rounded-full before:bg-gray-400
        `,
      },
    },
  },
});
