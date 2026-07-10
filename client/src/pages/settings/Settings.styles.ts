import { tv } from 'tailwind-variants';

export const settingsStyles = tv({
  slots: {
    label: 'text-gray-900',
    select: `
      mt-2 rounded-lg border border-gray-300
      bg-white px-3 py-2 text-gray-900
    `,
  },
});
