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
    details: 'flex flex-col gap-2 text-[20px] leading-relaxed text-gray-700',
    code: `
      overflow-x-auto rounded-2xl bg-gray-950 p-5 font-mono text-[16px]
      leading-relaxed text-gray-100
    `,
    language: 'mb-2 block text-[12px] uppercase tracking-wide text-gray-500',
    cursor:
      'ml-1 inline-block h-[1em] w-0.5 animate-pulse bg-current align-middle',
  },
  variants: {
    live: {
      true: { question: 'text-gray-500' },
    },
  },
});

export const codeTokenStyles = tv({
  variants: {
    kind: {
      keyword: 'text-violet-300',
      string: 'text-emerald-300',
      number: 'text-amber-300',
      comment: 'text-gray-500 italic',
      plain: '',
    },
  },
});
