import { tv } from 'tailwind-variants';

export const teamSelectStyles = tv({
  slots: {
    card: `
      flex w-full items-center gap-3 rounded-2xl border border-gray-200
      bg-white p-2.5 transition-colors duration-150
      hover:border-gray-300 active:bg-gray-50
    `,
    avatar: `
      relative flex size-10 shrink-0 items-center justify-center
      overflow-hidden rounded-full text-base font-semibold
      text-ai-foreground
      bg-[linear-gradient(135deg,#3b82f6,#8b5cf6,#ec4899)]
      shadow-[0_2px_10px_-2px_rgba(139,92,246,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]
    `,
    avatarImage: 'size-full object-cover',
    info: 'flex min-w-0 flex-col',
    name: 'truncate text-[15px] font-semibold leading-5 text-gray-900',
    email: 'truncate text-[13px] leading-4 text-gray-500',
    authBtn: 'w-full',
  },
  variants: {
    collapsed: {
      true: {
        card: 'justify-center border-transparent bg-transparent p-0',
        avatar: 'size-9 text-sm',
      },
    },
  },
});
