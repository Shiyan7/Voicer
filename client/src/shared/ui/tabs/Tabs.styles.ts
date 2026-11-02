import { tv } from 'tailwind-variants';

export const tabsStyles = tv({
  slots: {
    root: 'relative flex w-full items-center gap-1 rounded-xl bg-gray-100 p-1',
    indicator: 'absolute top-0 left-0 bg-white',
    item: 'relative flex-1',
    btn: `
      relative flex w-full items-center justify-center font-medium outline-none transition-colors
      duration-200 focus-visible:ring-2 focus-visible:ring-gray-300
    `,
  },
  variants: {
    size: {
      sm: {
        root: 'w-auto gap-0.5 rounded-lg p-0.5',
        item: 'flex-none',
        indicator: 'rounded-md',
        btn: 'h-7 rounded-md px-3 text-[13px] tabular-nums',
      },
      md: {
        indicator: 'rounded-lg',
        btn: 'h-10 rounded-lg px-4 text-sm',
      },
    },
    animated: {
      true: {
        indicator: `
          transition-[transform,width] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]
          motion-reduce:transition-none
        `,
      },
    },
    active: {
      true: {
        btn: 'text-gray-900',
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
