import { tv } from 'tailwind-variants';

export const settingsSectionStyles = tv({
  slots: {
    section: 'flex flex-col gap-2',
    title: 'px-1 text-[13px] font-medium text-gray-500',
    card: `
      flex flex-col divide-y divide-gray-200
      rounded-2xl border border-gray-200 bg-white
    `,
  },
});
