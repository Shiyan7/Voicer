import { tv } from 'tailwind-variants';

export const navigationStyles = tv({
  slots: {
    root: 'sticky top-0 z-navigation h-screen self-start',
    sidebar: `
      relative z-1 flex h-full flex-col p-3
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
    search: `
      flex h-11 w-full items-center gap-2.5 rounded-xl bg-white px-3
      text-[15px] text-gray-500 shadow-[0_1px_2px_rgba(0,0,0,0.04)]
      transition-colors hover:text-gray-700 active:bg-gray-50
    `,
    searchIcon: 'size-[18px] shrink-0',
    searchLabel: 'flex-1 text-left',
    searchHotkey: `
      rounded-md bg-gray-100 px-1.5 py-0.5
      font-sans text-[11px] font-medium text-gray-500
    `,
    account: 'mt-auto',
  },
  variants: {
    collapsed: {
      true: {
        sidebar: 'w-16',
        search: 'justify-center px-0',
      },
      false: {
        sidebar: 'w-60',
      },
    },
  },
});
