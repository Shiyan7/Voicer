import { tv } from 'tailwind-variants';

export const tabsStyles = tv({
  slots: {
    root: 'flex w-full items-center gap-1 rounded-xl bg-gray-100 p-1',
    item: 'relative flex-1',
    btn: `
      relative flex h-10 w-full items-center justify-center rounded-lg px-4 text-sm
      font-medium outline-none transition-[background-color,color]
      duration-200 focus-visible:ring-2 focus-visible:ring-gray-300
    `,
  },
  variants: {
    size: {
      sm: {
        root: 'w-auto gap-0.5 rounded-lg p-0.5',
        item: 'flex-none',
        btn: 'h-7 rounded-md px-3 text-[13px] tabular-nums',
      },
      md: {},
    },
    active: {
      true: {
        btn: 'bg-white text-gray-900',
      },
      false: {
        btn: 'text-gray-500 hover:text-gray-900',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
