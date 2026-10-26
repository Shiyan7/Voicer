import { tv } from 'tailwind-variants';

export const searchResultItemStyles = tv({
  slots: {
    root: `
      flex w-full cursor-pointer items-start gap-4 rounded-xl px-3 py-3
      text-left transition-colors
    `,
    icon: 'mt-0.5 shrink-0 text-gray-500',
    body: 'flex min-w-0 flex-1 flex-col gap-0.5',
    title: 'truncate text-[15px] font-medium text-gray-900',
    snippet: 'truncate text-sm text-gray-500',
    match: 'bg-transparent font-semibold text-gray-900',
    date: 'mt-0.5 shrink-0 text-[13px] text-gray-400 tabular-nums',
  },
  variants: {
    active: {
      true: { root: 'bg-gray-200/60' },
    },
  },
});
