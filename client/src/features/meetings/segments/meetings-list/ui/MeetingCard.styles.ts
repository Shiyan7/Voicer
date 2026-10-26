import { tv } from 'tailwind-variants';

export const meetingCardStyles = tv({
  slots: {
    card: `
      group relative flex w-full items-center gap-4 px-5 py-4 text-left
      transition-colors hover:bg-gray-200/50
    `,
    open: `
      absolute inset-0
      focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-500/60
    `,
    icon: 'shrink-0 text-gray-500 transition-colors',
    body: 'flex min-w-0 flex-1 items-center gap-2',
    title: 'truncate text-[15px] font-medium text-gray-900',
    duration: 'shrink-0 text-[13px] text-gray-400',
    date: `
      shrink-0 text-[13px] text-gray-500 tabular-nums transition-opacity
      group-hover:opacity-0
    `,
    actions: `
      absolute right-5 z-10 flex items-center gap-1 opacity-0
      transition-opacity group-hover:opacity-100
    `,
    deleteBtn: `
      flex size-8 cursor-pointer items-center justify-center rounded-lg text-gray-400
      transition-colors hover:bg-red-50 hover:text-red-600
      focus-visible:ring-2 focus-visible:ring-red-500/60
    `,
  },
});
