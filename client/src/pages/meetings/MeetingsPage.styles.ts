import { tv } from 'tailwind-variants';

export const meetingsPageStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-3xl flex-col gap-6 py-6',
    header: 'flex items-center justify-between gap-4',
    title: 'text-2xl font-semibold tracking-title text-gray-900',
    uploadInput: 'hidden',
    list: 'flex flex-col gap-3',
    card: `
      group flex w-full items-center gap-4 rounded-2xl border border-black/5
      bg-white px-5 py-4 text-left shadow-xs outline-none
      transition-[box-shadow,transform] duration-150
      hover:shadow-md active:scale-[0.995]
      focus-visible:ring-2 focus-visible:ring-gray-500/60
    `,
    cardBody: 'flex min-w-0 flex-1 flex-col gap-1',
    cardTitle: 'truncate text-[15px] font-medium text-gray-900',
    cardMeta: 'text-[13px] text-gray-500',
    chevron:
      'shrink-0 text-gray-300 transition-colors group-hover:text-gray-500',
    empty: `
      flex flex-col items-center gap-1 rounded-2xl border border-dashed
      border-gray-300 px-6 py-16 text-center
    `,
    emptyTitle: 'text-sm font-medium text-gray-600',
    skeleton: 'h-[74px] animate-pulse rounded-2xl bg-gray-100',
  },
});
