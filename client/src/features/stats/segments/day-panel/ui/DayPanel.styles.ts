import { tv } from 'tailwind-variants';

export const dayPanelStyles = tv({
  slots: {
    root: 'rounded-2xl border border-black/5 bg-white px-6 py-5',
    hint: 'py-4 text-center text-sm text-gray-400',
    header: 'flex items-baseline justify-between gap-3',
    title: 'text-[15px] font-semibold text-gray-900',
    summary: 'text-[13px] text-gray-500 tabular-nums',
    list: 'mt-3 flex flex-col',
    item: `
      -mx-3 flex items-center gap-4 rounded-xl px-3 py-2.5
      transition-colors hover:bg-gray-50
    `,
    time: 'w-16 shrink-0 whitespace-nowrap text-[13px] text-gray-400 tabular-nums',
    body: 'flex min-w-0 flex-1 flex-col',
    itemTitle: 'truncate text-sm font-medium text-gray-900',
    source: 'truncate text-xs text-gray-500',
    duration: 'shrink-0 text-[13px] text-gray-500 tabular-nums',
    skeleton: 'mt-3 h-12 animate-pulse rounded-xl bg-gray-100',
  },
});
