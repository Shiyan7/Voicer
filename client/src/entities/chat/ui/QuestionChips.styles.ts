import { tv } from 'tailwind-variants';

export const questionChipsStyles = tv({
  slots: {
    root: 'flex flex-col items-end gap-2',
    chip: `
      max-w-full rounded-2xl border border-gray-200 px-4 py-2 text-left
      text-[14px] leading-snug text-gray-900 transition-colors
      hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed
      disabled:opacity-50 disabled:hover:bg-transparent
    `,
    skeleton: 'h-9 animate-pulse rounded-full bg-gray-100',
  },
});
