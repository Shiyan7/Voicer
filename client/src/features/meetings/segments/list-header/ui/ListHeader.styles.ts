import { tv } from 'tailwind-variants';

export const listHeaderStyles = tv({
  slots: {
    root: 'flex items-center justify-between gap-4 px-1',
    title: 'text-[15px] font-medium text-gray-500',
    count: 'font-bold text-gray-900',
    actions: 'flex items-center gap-1',
    iconBtn: `
      relative flex size-9 cursor-pointer items-center justify-center rounded-lg
      text-gray-600 transition-colors hover:bg-gray-900/5 hover:text-gray-900
      focus-visible:ring-2 focus-visible:ring-gray-500/60
    `,
    chip: `
      flex h-8 items-center gap-1 rounded-full bg-gray-900/5 pl-3 pr-1
      text-xs font-medium text-gray-900
    `,
    chipClear: `
      flex size-6 cursor-pointer items-center justify-center rounded-full
      text-gray-500 transition-colors hover:bg-gray-900/10 hover:text-gray-900
    `,
    dot: 'absolute right-1.5 top-1.5 size-1.5 rounded-full bg-gray-900',
  },
  variants: {
    active: {
      true: { iconBtn: 'bg-gray-900/5 text-gray-900' },
    },
  },
});
