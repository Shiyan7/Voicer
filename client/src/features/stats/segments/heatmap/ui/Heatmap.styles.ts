import { tv } from 'tailwind-variants';

export const heatmapStyles = tv({
  slots: {
    root: 'rounded-2xl border border-black/5 bg-white px-6 py-5',
    header: 'flex flex-wrap items-center justify-between gap-3',
    title: 'text-[15px] font-semibold text-gray-900',
    body: 'mt-4 flex gap-2',
    weekdays: 'flex flex-col pt-5 text-[11px] text-gray-400',
    weekdayRows: 'grid flex-1 grid-rows-7 gap-[3px]',
    weekday: 'flex items-center leading-none',
    grid: 'relative min-w-0 flex-1',
    months: 'relative mb-1.5 h-3.5 text-[11px] text-gray-400',
    month: 'absolute top-0 whitespace-nowrap',
    weeks: 'flex gap-[3px]',
    week: 'flex min-w-0 flex-1 flex-col gap-[3px]',
    cell: 'aspect-square w-full rounded-[3px] transition-opacity duration-150',
    tooltip: `
      pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full
      -mt-2 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5
      text-xs font-medium text-white shadow-lg
    `,
    footer: 'mt-3 flex items-center justify-end gap-1.5 text-[11px] text-gray-400',
    legendCell: 'size-[11px] rounded-[3px]',
  },
  variants: {
    level: {
      0: { cell: 'bg-gray-100', legendCell: 'bg-gray-100' },
      1: { cell: 'bg-heat-1', legendCell: 'bg-heat-1' },
      2: { cell: 'bg-heat-2', legendCell: 'bg-heat-2' },
      3: { cell: 'bg-heat-3', legendCell: 'bg-heat-3' },
      4: { cell: 'bg-heat-4', legendCell: 'bg-heat-4' },
    },
    outside: {
      true: { cell: 'invisible' },
    },
    future: {
      true: { cell: 'opacity-40' },
      false: { cell: 'cursor-pointer' },
    },
    dimmed: {
      true: { cell: 'opacity-25 hover:opacity-60' },
    },
    loading: {
      true: { weeks: 'animate-pulse' },
    },
  },
});
