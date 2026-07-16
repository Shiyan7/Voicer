import { tv } from 'tailwind-variants';

export const settingsStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-2xl flex-col gap-8 p-8',
    pageTitle: 'text-2xl font-semibold tracking-title text-gray-900',
  },
});

export const settingsSectionStyles = tv({
  slots: {
    section: 'flex flex-col gap-2',
    sectionTitle: 'px-1 text-[13px] font-medium text-gray-500',
    card: `
      flex flex-col divide-y divide-gray-200
      rounded-2xl border border-gray-200 bg-white shadow-xs
    `,
    row: 'flex items-center justify-between gap-4 px-5 py-4',
    rowText: 'flex min-w-0 flex-col gap-0.5',
    rowLabel: 'text-[15px] text-gray-900',
    rowHint: 'text-[13px] text-gray-500',
  },
});
