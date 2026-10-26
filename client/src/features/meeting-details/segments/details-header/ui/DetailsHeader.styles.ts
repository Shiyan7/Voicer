import { tv } from 'tailwind-variants';

export const detailsHeaderStyles = tv({
  slots: {
    header: 'flex min-w-0 flex-col gap-4',
    titleRow: 'flex min-w-0 items-center gap-4',
    back: `
      flex size-9 shrink-0 items-center justify-center rounded-xl border
      border-black/5 bg-white text-gray-700 outline-none
      shadow-[0_1px_2px_rgba(0,0,0,0.04)]
      transition-[background-color,color,transform] duration-150
      hover:bg-gray-100 hover:text-gray-900 active:scale-95
      focus-visible:ring-2 focus-visible:ring-gray-300
    `,
    title: 'truncate text-2xl font-semibold tracking-title text-gray-900',
    chips: 'flex flex-wrap items-center gap-2',
    chip: `
      inline-flex h-7 items-center gap-1.5 rounded-full border border-black/5
      bg-white/80 px-2.5 text-[13px] font-medium text-gray-600
    `,
    chipIcon: 'size-3.5 shrink-0 text-gray-400',
    avatars: 'flex items-center -space-x-1.5',
  },
});
