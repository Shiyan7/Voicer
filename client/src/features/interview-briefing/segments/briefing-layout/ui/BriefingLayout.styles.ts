import { tv } from 'tailwind-variants';

export const briefingLayoutStyles = tv({
  slots: {
    root: 'mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col gap-6 pt-6',
    status: 'animate-pulse text-[15px] text-gray-500',
    skeletonHeader: 'h-16 animate-pulse rounded-2xl bg-gray-100',
    skeletonContent: 'h-64 animate-pulse rounded-2xl bg-gray-100',
    failed: 'flex items-center justify-between gap-3 text-[15px] text-red-600',
    footer: 'sticky bottom-6 mt-auto flex justify-center pb-6 pt-2',
  },
});
