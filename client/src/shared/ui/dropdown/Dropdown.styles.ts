import { tv } from 'tailwind-variants';

export const dropdownStyles = tv({
  slots: {
    root: 'relative inline-flex',
    panel: `
      absolute right-0 top-[calc(100%+8px)] z-50 min-w-60
      origin-top-right overflow-hidden rounded-2xl border border-gray-200
      bg-white
    `,
    item: `
      flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm
      font-medium text-gray-700 transition-colors hover:bg-gray-200
      border-b border-gray-200 last:border-b-0
    `,
    itemIcon: 'shrink-0 text-gray-500',
    itemEmoji: 'shrink-0 text-base leading-none',
    itemLabel: 'flex-1 truncate',
    check: 'shrink-0 text-gray-900',
  },
  variants: {
    active: {
      true: {
        item: 'text-gray-900',
      },
    },
  },
});
