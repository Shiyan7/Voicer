import { tv } from 'tailwind-variants';

export const sourcesStyles = tv({
  slots: {
    root: 'rounded-2xl border border-black/5 bg-white px-6 py-5',
    title: 'text-[15px] font-semibold text-gray-900',
    list: 'mt-4 flex flex-col gap-3',
    row: 'flex flex-col gap-1.5',
    meta: 'flex items-baseline justify-between gap-3 text-[13px]',
    label: 'truncate font-medium text-gray-900',
    numbers: 'shrink-0 text-gray-500 tabular-nums',
    track: 'h-2 overflow-hidden rounded-full bg-gray-100',
    bar: 'h-full rounded-full bg-heat-3',
    empty: 'py-6 text-center text-sm text-gray-400',
  },
});
