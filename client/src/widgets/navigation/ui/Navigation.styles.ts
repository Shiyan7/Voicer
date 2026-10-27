import { tv } from 'tailwind-variants';

export const navigationStyles = tv({
  slots: {
    root: 'sticky top-0 z-navigation h-screen self-start',
    sidebar: 'relative z-1 flex h-full flex-col px-3 py-6 bg-gray-100',
    toggle: `
      absolute -right-3 top-6 z-20 flex size-6 items-center justify-center
      rounded-full border-[0.5px] border-gray-300 bg-white text-gray-500
      shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-[color,transform]
      hover:scale-110 hover:text-gray-900
    `,
    toggleIcon: 'size-3.5',
    search: `
      flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl bg-white px-2.5
      text-[15px] font-medium text-gray-900
      transition-colors
      active:bg-gray-50
    `,
    searchIcon: 'size-[18px] shrink-0',
    searchLabel: 'flex-1 text-left text-gray-500',
    searchHotkey: `
      rounded-md bg-gray-100 px-1.5 py-0.5
      font-sans text-[11px] font-medium text-gray-500
    `,
    logo: 'mb-4 flex h-9 items-center px-1',
    account: 'mt-auto flex flex-col gap-4',
  },
  variants: {
    collapsed: {
      true: {
        sidebar: 'w-[72px] items-center',
        logo: 'justify-center px-0',
        search: 'size-11 justify-center px-0',
        account: 'items-center',
      },
      false: {
        sidebar: 'w-60',
      },
    },
  },
});
