import { tv } from 'tailwind-variants';

export const briefingSectionsStyles = tv({
  slots: {
    root: 'flex flex-col gap-4',
    items: 'flex list-decimal flex-col gap-3 pl-6 marker:text-gray-400',
    item: 'pl-1 text-[15px] leading-relaxed text-gray-800',
  },
});
