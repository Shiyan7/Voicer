import { tv } from 'tailwind-variants';

export const transcriptSearchPanelStyles = tv({
  slots: {
    anchor: 'sticky top-0 z-30 h-0',
    panel: `
      absolute top-4 left-4 flex w-[300px] flex-col gap-3 rounded-2xl
      border border-gray-200 bg-white px-4 pt-3 pb-3 shadow-xl
    `,
    header: 'flex items-center justify-between',
    title: 'text-[15px] font-semibold text-gray-900',
    close: `
      -mr-1 flex size-7 items-center justify-center rounded-lg
      text-gray-700 transition-colors hover:bg-gray-100
    `,
    fields: 'flex flex-col gap-2',
    field: 'relative',
    fieldIcon: `
      pointer-events-none absolute top-1/2 left-3 -translate-y-1/2
      text-gray-500
    `,
    input: 'h-10 pl-9 text-sm',
    queryInput: 'pr-24',
    suffix: `
      absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-0.5
    `,
    results: 'mr-1 text-xs tabular-nums text-gray-500',
    navButton: `
      flex size-6 items-center justify-center rounded-md text-gray-500
      transition-colors hover:bg-gray-100 hover:text-gray-900
      disabled:pointer-events-none disabled:opacity-40
    `,
    arrowRight: 'rotate-90',
    chevronUp: 'rotate-90',
    chevronDown: '-rotate-90',
    options: 'flex flex-col gap-2.5 pt-1',
    option: `
      flex cursor-pointer items-center gap-3 text-sm font-medium
      text-gray-800
    `,
    checkbox: 'size-[18px] rounded accent-gray-900',
    actions: 'flex justify-end gap-1 pt-1',
    action: `
      rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-900
      transition-colors hover:bg-gray-100
      disabled:pointer-events-none disabled:text-gray-400
    `,
  },
});
