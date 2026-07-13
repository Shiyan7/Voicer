import { tv } from 'tailwind-variants';

export const detailsHeaderStyles = tv({
  slots: {
    header: 'flex flex-col gap-1.5',
    titleRow: 'flex items-start justify-between gap-3',
    title: `
      min-w-0 cursor-text truncate rounded-md text-2xl font-semibold
      tracking-title text-gray-900 transition-opacity duration-150
      hover:opacity-70
    `,
    titleInput: `
      w-full rounded-md bg-transparent text-2xl font-semibold
      tracking-title text-gray-900 caret-gray-900 outline-none
    `,
    deleteBtn: 'shrink-0 text-gray-500 hover:text-red-600',
    metaRow: 'flex flex-wrap items-center gap-3 text-[13px] text-gray-500',
    modalTitle: 'mb-2 pr-8 text-lg font-semibold tracking-title text-gray-900',
    modalText: 'mb-5 text-sm leading-6 text-gray-600',
    modalActions: 'flex justify-end gap-2',
  },
});
