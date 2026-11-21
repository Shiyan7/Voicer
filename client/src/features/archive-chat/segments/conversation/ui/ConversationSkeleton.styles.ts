import { tv } from 'tailwind-variants';

export const conversationSkeletonStyles = tv({
  slots: {
    root: 'flex flex-col gap-6',
    question: 'h-11 w-2/5 animate-pulse self-end rounded-2xl bg-gray-100',
    answer: 'flex flex-col gap-2.5',
    line: 'h-4 animate-pulse rounded-md bg-gray-100',
  },
});
