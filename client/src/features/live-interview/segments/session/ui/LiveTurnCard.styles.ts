import { tv } from 'tailwind-variants';

export const liveTurnCardStyles = tv({
  slots: {
    root: 'flex flex-col gap-4',
    question: `
      max-w-[90%] self-start rounded-2xl rounded-bl-md bg-gray-100 px-5 py-3.5
      text-[22px] leading-snug text-gray-900
    `,
    answer: 'flex flex-col gap-4',
    short: 'text-[26px] font-medium leading-snug text-gray-900',
    toggle: 'self-start',
    details: 'text-[20px] leading-relaxed text-gray-700',
    cursor:
      'ml-1 inline-block h-[1em] w-0.5 animate-pulse bg-current align-middle',
  },
  variants: {
    live: {
      true: { question: 'text-gray-500' },
    },
  },
});
