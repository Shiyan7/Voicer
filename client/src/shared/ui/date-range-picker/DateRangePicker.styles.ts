import { tv } from 'tailwind-variants';

export const dateRangePickerStyles = tv({
  slots: {
    root: 'relative inline-flex',
    panel: `
      absolute right-0 top-[calc(100%+8px)] z-50 flex origin-top-right
      overflow-hidden rounded-2xl border border-gray-200 bg-white
    `,
    presets: 'flex w-40 flex-col gap-0.5 border-r border-gray-200 p-2',
    preset: `
      rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-900
      transition-colors hover:bg-gray-900/5
    `,
    calendar: 'flex w-72 flex-col gap-2 p-3',
    header: 'flex items-center justify-between',
    monthTitle: 'text-sm font-semibold capitalize text-gray-900',
    navButton: `
      flex size-8 items-center justify-center rounded-lg text-gray-600
      transition-colors hover:bg-gray-900/5 hover:text-gray-900
      disabled:pointer-events-none disabled:opacity-30
    `,
    grid: 'grid grid-cols-7 gap-y-0.5',
    weekday: `
      flex h-7 items-center justify-center text-[11px] font-medium
      capitalize text-gray-400
    `,
    day: 'flex h-9 items-center justify-center text-sm text-gray-900',
    dayButton: `
      flex size-9 cursor-pointer items-center justify-center rounded-lg
      transition-colors hover:bg-gray-900/10
      disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent
    `,
    footer: `
      flex min-h-9 items-center justify-between gap-2
      border-t border-gray-200 pt-2
    `,
    hint: 'text-xs text-gray-400',
    clear: `
      rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600
      transition-colors hover:bg-gray-900/5 hover:text-gray-900
    `,
  },
  variants: {
    outside: {
      true: { day: 'text-gray-400' },
    },
    inRange: {
      true: { day: 'bg-gray-900/5' },
    },
    today: {
      true: { dayButton: 'font-bold underline underline-offset-4' },
    },
    edge: {
      true: { dayButton: 'bg-gray-900 text-white hover:bg-gray-800' },
    },
  },
});
