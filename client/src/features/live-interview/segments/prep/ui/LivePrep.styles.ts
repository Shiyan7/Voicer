import { tv } from 'tailwind-variants';

export const livePrepStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-3xl flex-col gap-6 py-6',
    title: 'text-2xl font-semibold tracking-title text-gray-900',
    subtitle: 'text-[15px] text-gray-500',
    history:
      'flex flex-col gap-1 rounded-2xl border border-gray-200 bg-white p-2',
    historyTitle: 'px-3 py-2 text-[13px] font-medium text-gray-600',
    historyItem: `
      flex items-center gap-3 rounded-xl px-3 py-2 text-left text-[14px]
      transition-colors hover:bg-gray-50
    `,
    historyDate: 'shrink-0 text-gray-500 tabular-nums',
    historyVacancy: 'min-w-0 flex-1 truncate text-gray-900',
    badge: 'shrink-0 rounded-full px-2 py-0.5 text-[12px] font-medium',
    card: 'flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5',
    label: 'text-[13px] font-medium text-gray-600',
    file: `
      flex cursor-pointer items-center gap-3 rounded-xl border border-dashed
      border-gray-300 px-4 py-3 text-[15px] transition-colors
      hover:border-gray-500
    `,
    fileName: 'truncate',
    fileInput: 'hidden',
    textarea: `
      min-h-36 w-full resize-y rounded-lg border border-gray-300 bg-white
      px-3.5 py-3 text-[15px] text-gray-900 outline-none
      placeholder:text-gray-500 focus:border-gray-500
    `,
    actions: 'flex justify-end',
    loading: 'animate-pulse text-[15px] text-gray-500',
    error: 'text-[15px] text-red-600',
    sections: 'grid gap-4 sm:grid-cols-3',
    section: 'flex flex-col gap-2 rounded-2xl bg-gray-50 p-4',
    sectionTitle: 'text-[15px] font-semibold text-gray-900',
    item: `
      relative pl-4 text-[14px] leading-relaxed text-gray-700
      before:absolute before:left-1 before:top-[0.7em] before:size-1
      before:rounded-full before:bg-gray-400
    `,
    start: 'self-center',
  },
  variants: {
    filled: {
      true: { file: 'text-gray-900' },
      false: { file: 'text-gray-500' },
    },
    finished: {
      true: { badge: 'bg-gray-100 text-gray-600' },
      false: { badge: 'bg-amber-50 text-amber-700' },
    },
  },
});
