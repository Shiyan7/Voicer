import { tv } from 'tailwind-variants';

export const navigationStyles = tv({
  slots: {
    root: 'sticky top-0 z-navigation h-screen self-start',
    sidebar: `
      relative z-1 h-full p-3
      bg-gray-100
      border-r-[0.5px] border-r-gray-300
    `,
    toggle: `
      absolute left-full top-5 z-20
      flex h-8 w-6.5 items-center justify-center
      rounded-[0_5px_5px_0] border-[0.5px] border-l-0
      border-gray-300 bg-gray-100 pr-px
    `,
    toggleIcon: 'h-6 w-6',
  },
  variants: {
    collapsed: {
      true: {
        sidebar: 'w-16',
      },
      false: {
        sidebar: 'w-60',
      },
    },
  },
});
