import { tv } from 'tailwind-variants';

export const codeBlockStyles = tv({
  slots: {
    root: 'relative rounded-2xl bg-[#18181b] text-[#f4f4f5]',
    header: 'flex items-center justify-between px-5 pt-3',
    language: 'text-[12px] uppercase tracking-wide text-[#71717a]',
    copy: `
      flex size-8 items-center justify-center rounded-lg text-[#a1a1aa]
      transition-colors hover:bg-[#ffffff1a] hover:text-[#fff]
    `,
    pre: `
      whitespace-pre-wrap break-words px-5 pt-2 pb-5 font-mono text-[16px]
      leading-relaxed
    `,
  },
});

export const codeTokenStyles = tv({
  variants: {
    kind: {
      keyword: 'text-violet-300',
      string: 'text-emerald-300',
      number: 'text-amber-300',
      comment: 'text-[#71717a] italic',
      type: 'text-sky-300',
      call: 'text-rose-300',
      plain: '',
    },
  },
});
