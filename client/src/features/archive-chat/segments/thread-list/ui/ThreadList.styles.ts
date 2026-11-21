import { tv } from 'tailwind-variants';

export const threadListStyles = tv({
  slots: {
    root: `
      flex w-64 shrink-0 flex-col gap-4 border-r border-gray-200
      bg-gray-50 px-3 pb-3 pt-5
    `,
    newButton: `
      flex h-9 items-center gap-2.5 rounded-full px-3 text-[14px] font-medium
      text-gray-900 transition-colors hover:bg-gray-200/70
    `,
    section: 'flex min-h-0 flex-1 flex-col gap-1',
    sectionTitle: 'px-3 pb-0.5 text-[12px] font-medium text-gray-500',
    list: 'flex flex-1 flex-col gap-1 overflow-y-auto',
    empty: 'px-3 text-[13px] text-gray-400',
    skeletonItem: 'flex h-9 shrink-0 items-center px-3',
    skeleton: 'h-3.5 animate-pulse rounded-md bg-gray-200',
    item: `
      group flex h-9 shrink-0 items-center rounded-full pr-1
      transition-colors hover:bg-gray-200/70
      has-[[aria-expanded=true]]:bg-gray-200/70
    `,
    link: 'min-w-0 flex-1 truncate py-1.5 pl-3 text-[14px] text-gray-800',
    actions: 'relative flex shrink-0 items-center justify-center',
    pin: `
      pointer-events-none absolute text-gray-500 transition-opacity
      group-hover:opacity-0 group-focus-within:opacity-0
      group-has-[[aria-expanded=true]]:opacity-0
    `,
    menu: `
      opacity-0 transition-opacity group-hover:opacity-100
      focus-within:opacity-100 has-[[aria-expanded=true]]:opacity-100
    `,
  },
  variants: {
    active: {
      true: {
        item: 'bg-gray-200/70',
        link: 'font-medium text-gray-900',
      },
    },
  },
});
