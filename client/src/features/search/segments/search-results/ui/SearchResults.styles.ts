import { tv } from 'tailwind-variants';

export const searchResultsStyles = tv({
  slots: {
    root: 'flex min-h-0 flex-col border-t-[0.5px] border-gray-200',
    header: 'flex items-center justify-between px-6 pb-1 pt-4',
    label: 'text-sm font-medium text-gray-500',
    sortTrigger: `
      flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm
      font-medium text-gray-700 transition-colors hover:bg-gray-200/60
      hover:text-gray-900
    `,
    list: 'flex max-h-[60vh] flex-col overflow-y-auto px-3 pb-3',
    state: `
      flex flex-col items-center gap-2 px-6 py-14 text-center
      text-sm text-gray-500
    `,
    sentinel: 'h-px shrink-0',
    stateIcon: 'mb-1 text-gray-400',
    skeleton: 'flex items-start gap-4 rounded-xl px-3 py-3',
    skeletonIcon: 'mt-0.5 size-5 shrink-0 animate-pulse rounded-md bg-gray-100',
    skeletonLines: 'flex flex-1 flex-col gap-2',
    skeletonTitle: 'h-4 w-2/5 animate-pulse rounded-md bg-gray-100',
    skeletonText: 'h-3.5 w-4/5 animate-pulse rounded-md bg-gray-100',
  },
});
