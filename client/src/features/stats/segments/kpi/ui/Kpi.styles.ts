import { tv } from 'tailwind-variants';

export const kpiStyles = tv({
  slots: {
    root: 'grid grid-cols-2 gap-3 sm:grid-cols-5',
    tile: 'flex min-w-0 flex-col gap-0.5 rounded-2xl border border-black/5 bg-white px-4 py-3.5',
    value: 'text-xl font-semibold text-gray-900 tabular-nums',
    label: 'text-[13px] leading-4 text-gray-500',
    skeleton: 'h-[76px] animate-pulse rounded-2xl bg-gray-100',
  },
});
