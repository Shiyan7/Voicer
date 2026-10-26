import { tv } from 'tailwind-variants';

export const meetingsSkeletonStyles = tv({
  slots: {
    list: `
      flex flex-col divide-y divide-black/5 overflow-hidden rounded-2xl
      border border-black/5 bg-white
    `,
    row: 'flex h-[60px] items-center gap-4 px-5',
    icon: 'size-5 animate-pulse rounded-md bg-gray-100',
    line: 'h-4 w-1/2 animate-pulse rounded-md bg-gray-100',
  },
});
