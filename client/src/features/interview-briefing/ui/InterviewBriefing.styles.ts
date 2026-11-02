import { tv } from 'tailwind-variants';

export const interviewBriefingStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-3xl flex-col gap-6 py-6',
    header: 'flex items-center gap-4',
    title: 'text-2xl font-semibold tracking-title text-gray-900',
    status: 'animate-pulse text-[15px] text-gray-500',
    failed: 'flex items-center justify-between gap-3 text-[15px] text-red-600',
    section: 'flex flex-col gap-4 rounded-2xl bg-gray-50 p-4',
    items: 'flex list-decimal flex-col gap-3 pl-6 marker:text-gray-400',
    item: 'pl-1 text-[15px] leading-relaxed text-gray-800',
    start: 'self-end',
    skeleton: 'animate-pulse rounded-2xl bg-gray-100',
  },
  variants: {
    size: {
      header: { skeleton: 'h-16' },
      content: { skeleton: 'h-64' },
    },
  },
});
