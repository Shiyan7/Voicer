import { tv } from 'tailwind-variants';

export const accountCardStyles = tv({
  slots: {
    card: `
      flex w-full items-center gap-3 rounded-xl p-2
      transition-colors duration-150 hover:bg-gray-200 active:bg-gray-300
    `,
    avatar: `
      relative flex size-10 shrink-0 items-center justify-center
      overflow-hidden rounded-full text-base font-semibold
      text-ai-foreground
      bg-[#0ea5e9]
    `,
    avatarImage: 'size-full object-cover',
    info: 'flex min-w-0 flex-col',
    name: 'truncate text-[15px] font-semibold leading-5 text-gray-900',
    email: 'truncate text-[13px] leading-4 text-gray-500',
    authBtn: 'w-full px-4 text-sm',
  },
  variants: {
    collapsed: {
      true: {
        card: 'justify-center p-1',
        avatar: 'size-9 text-sm',
      },
    },
  },
});
