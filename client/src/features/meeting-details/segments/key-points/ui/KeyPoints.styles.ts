import { tv } from 'tailwind-variants';

export const keyPointsStyles = tv({
  slots: {
    section: 'flex flex-col',
    sectionTitle: 'mb-3 text-xl font-semibold tracking-title text-gray-900',
    list: 'flex flex-col gap-3',
    item: '-mx-2 flex gap-3 rounded-lg px-2 text-[15px] leading-7 text-gray-800',
    bullet: 'mt-[11px] size-1.5 shrink-0 rounded-full bg-gray-800',
    text: 'min-w-0 flex-1',
  },
  variants: {
    focused: {
      true: { item: 'animate-focus-flash' },
    },
  },
});
