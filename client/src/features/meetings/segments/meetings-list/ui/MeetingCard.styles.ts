import { tv } from 'tailwind-variants';

export const meetingCardStyles = tv({
  slots: {
    card: `
      group flex w-full items-center gap-4 rounded-xl border border-black/5
      bg-white px-5 py-4 text-left hover:scale-[1.005]
      transition-[border,scale] active:scale-[0.998]
      focus-visible:ring-2 focus-visible:ring-gray-500/60
      hover:border-black/8
    `,
    icon: 'shrink-0 transition-colors',
    body: 'flex min-w-0 flex-1 items-center gap-2',
    title: 'truncate text-[15px] font-medium text-gray-900',
    duration: 'shrink-0 text-[13px] text-gray-400',
    date: 'shrink-0 text-[13px] text-gray-500 tabular-nums',
  },
});
