import { tv } from 'tailwind-variants';

export const meetingCardStyles = tv({
  slots: {
    card: `
      group flex w-full items-center gap-4 rounded-2xl border border-black/5
      bg-white px-5 py-4 text-left shadow-xs outline-none
      transition-[box-shadow,transform] duration-150
      hover:shadow-md active:scale-[0.995]
      focus-visible:ring-2 focus-visible:ring-gray-500/60
    `,
    body: 'flex min-w-0 flex-1 flex-col gap-1',
    title: 'truncate text-[15px] font-medium text-gray-900',
    meta: 'text-[13px] text-gray-500',
    chevron:
      'shrink-0 text-gray-300 transition-colors group-hover:text-gray-500',
  },
});
