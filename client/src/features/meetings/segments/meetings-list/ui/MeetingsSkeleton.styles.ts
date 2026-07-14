import { tv } from 'tailwind-variants';

export const meetingsSkeletonStyles = tv({
  slots: {
    list: 'flex flex-col gap-3',
    row: 'h-[74px] animate-pulse rounded-2xl bg-gray-100',
  },
});
