import { tv } from 'tailwind-variants';

export const settingsStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-2xl flex-col gap-8 p-8',
    pageTitle: 'text-2xl font-semibold tracking-title text-gray-900',
    section: 'flex flex-col gap-2',
    sectionTitle: 'px-1 text-[13px] font-medium text-gray-500',
    card: `
      flex flex-col divide-y divide-gray-200
      rounded-2xl border border-gray-200 bg-white shadow-xs
    `,
    row: 'flex items-center justify-between gap-4 px-5 py-4',
    rowText: 'flex min-w-0 flex-col gap-0.5',
    rowLabel: 'text-[15px] text-gray-900',
    rowHint: 'text-[13px] text-gray-500',
    rowActions: 'flex shrink-0 items-center gap-2',
    status: `
      flex items-center gap-1.5 text-[13px] text-gray-500
      before:size-2 before:rounded-full before:bg-gray-300
    `,
    select: `
      rounded-lg border border-gray-300
      bg-white px-3 py-2 text-sm text-gray-900
    `,
    toggle: `
      relative h-7 w-12 shrink-0 rounded-full bg-gray-300
      transition-colors duration-200
      outline-none focus-visible:ring-2 focus-visible:ring-gray-500/60
      focus-visible:ring-offset-2
    `,
    toggleThumb: `
      absolute left-0.5 top-0.5 size-6 rounded-full
      bg-white shadow-sm transition-transform duration-200
    `,
  },
  variants: {
    granted: {
      true: {
        status: 'text-gray-900 before:bg-green-500',
      },
      false: {
        status: 'before:bg-red-500',
      },
    },
    checked: {
      true: {
        toggle: 'bg-gray-900',
        toggleThumb: 'translate-x-5',
      },
    },
  },
});
