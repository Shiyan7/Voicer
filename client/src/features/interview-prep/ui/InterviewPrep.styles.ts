import { tv } from 'tailwind-variants';

export const interviewPrepStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-3xl flex-col gap-6 py-6',
    header: 'flex items-start gap-4',
    title: 'text-2xl font-semibold tracking-title text-gray-900',
    card: 'flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5',
    label: 'text-[13px] font-medium text-gray-600',
    textarea: `
      min-h-36 w-full resize-y rounded-lg border border-gray-300 bg-white
      px-3.5 py-3 text-[15px] text-gray-900 outline-none
      placeholder:text-gray-500 focus:border-gray-500
    `,
    modes: 'grid grid-cols-2 gap-3',
    mode: `
      flex cursor-pointer flex-col items-start gap-1 rounded-xl border p-4
      text-left text-gray-900 transition-colors
    `,
    modeTitle: 'mt-1 text-[15px] font-medium',
    modeDescription: 'text-[13px] leading-snug text-gray-500',
    language: `
      cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-[14px]
      text-gray-800 transition-colors hover:bg-gray-50
    `,
    languagePanel: 'right-auto left-0',
    languageValue: 'flex items-center gap-1.5',
    languageIcon: 'rotate-90 text-gray-500',
    actions: 'flex items-center justify-between gap-3',
    loading: 'animate-pulse text-[15px] text-gray-500',
    error: 'text-[15px] text-red-600',
    section: 'flex flex-col gap-4 rounded-2xl bg-gray-50 p-4',
    items: 'flex list-decimal flex-col gap-3 pl-6 marker:text-gray-400',
    item: 'pl-1 text-[15px] leading-relaxed text-gray-800',
    start: 'self-center',
  },
  variants: {
    selected: {
      true: { mode: 'border-gray-900' },
      false: { mode: 'border-gray-200 hover:border-gray-400' },
    },
  },
});
