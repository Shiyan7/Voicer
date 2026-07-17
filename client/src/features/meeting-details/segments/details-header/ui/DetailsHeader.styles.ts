import { tv } from 'tailwind-variants';

export const detailsHeaderStyles = tv({
  slots: {
    header: 'flex flex-col gap-1.5',
    title: 'truncate text-2xl font-semibold tracking-title text-gray-900',
    meta: 'text-[13px] text-gray-500',
  },
});
