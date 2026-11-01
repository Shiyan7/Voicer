import { tv } from 'tailwind-variants';

export const interviewSessionItemStyles = tv({
  slots: {
    root: `
      flex items-center gap-3 rounded-xl px-3 py-2 text-left text-[14px]
      transition-colors hover:bg-gray-50
    `,
    date: 'shrink-0 text-gray-500 tabular-nums',
    vacancy: 'min-w-0 flex-1 truncate text-gray-900',
    badge: `
      shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[12px] font-medium
      text-amber-700
    `,
  },
  variants: {
    finished: {
      true: { badge: 'bg-gray-100 text-gray-600' },
    },
  },
});
