import { tv } from 'tailwind-variants';

export const deleteMeetingModalStyles = tv({
  slots: {
    title: 'text-lg font-semibold text-gray-900',
    description: 'mt-2 text-sm leading-relaxed text-gray-500',
    footer: 'mt-6 flex items-center justify-end gap-2',
  },
});
