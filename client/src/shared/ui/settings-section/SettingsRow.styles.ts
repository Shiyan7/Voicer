import { tv } from 'tailwind-variants';

export const settingsRowStyles = tv({
  slots: {
    row: 'flex items-center justify-between gap-4 px-5 py-4',
    text: 'flex min-w-0 flex-col gap-0.5',
    label: 'text-[15px] text-gray-900',
    hint: 'text-[13px] text-gray-500',
  },
});
