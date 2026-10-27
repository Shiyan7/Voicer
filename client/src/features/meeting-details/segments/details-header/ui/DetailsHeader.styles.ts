import { tv } from 'tailwind-variants';

export const detailsHeaderStyles = tv({
  slots: {
    header: 'flex min-w-0 flex-1 flex-col gap-4',
    titleRow: 'flex w-full min-w-0 items-center gap-4',
    back: `
      flex size-9 shrink-0 items-center justify-center rounded-xl border
      border-black/5 bg-white text-gray-700 outline-none
      shadow-[0_1px_2px_rgba(0,0,0,0.04)]
      transition-[background-color,color,transform] duration-150
      hover:bg-gray-100 hover:text-gray-900 active:scale-95
      focus-visible:ring-2 focus-visible:ring-gray-300
    `,
    titleView: 'group flex min-w-0 items-center gap-1.5',
    title: 'truncate text-2xl font-semibold tracking-title text-gray-900',
    titleEdit: 'flex min-w-0 flex-1 items-center gap-1.5',
    titleInput: `
      min-w-0 flex-1 rounded-lg bg-white px-2 py-0.5 -ml-2 text-2xl
      font-semibold tracking-title text-gray-900 outline-none
      ring-1 ring-gray-200 focus:ring-gray-400
    `,
    iconBtn: `
      flex size-8 shrink-0 cursor-pointer items-center justify-center
      rounded-lg text-gray-400 transition-[color,background-color,opacity]
      hover:bg-gray-200/60 hover:text-gray-900
      focus-visible:ring-2 focus-visible:ring-gray-500/60
    `,
    editBtn: 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
    chips: 'flex flex-wrap items-center gap-2',
    chip: `
      inline-flex h-7 items-center gap-1.5 rounded-full border border-black/5
      bg-white/80 px-2.5 text-[13px] font-medium text-gray-600
    `,
    chipIcon: 'size-3.5 shrink-0 text-gray-400',
    avatars: 'flex items-center -space-x-1.5',
  },
  variants: {
    revealing: {
      true: {
        title: `
          animate-title-reveal bg-clip-text text-transparent bg-size-[300%_100%]
          bg-[linear-gradient(90deg,var(--color-gray-900)_0%,var(--color-gray-900)_33%,#0ea5e9_45%,#6366f1_52%,var(--color-gray-900)_64%,var(--color-gray-900)_100%)]
        `,
      },
    },
    busy: {
      true: { iconBtn: 'pointer-events-none animate-pulse text-sky-500' },
    },
  },
});
