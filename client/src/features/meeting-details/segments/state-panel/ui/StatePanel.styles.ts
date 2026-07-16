import { tv } from 'tailwind-variants';

export const statePanelStyles = tv({
  slots: {
    panel: `
      flex flex-col items-center gap-3 rounded-2xl border border-black/5
      bg-white px-6 py-14 text-center shadow-xs
    `,
    spinner: `
      size-8 animate-spin rounded-full border-2 border-gray-200
      border-t-gray-900
    `,
    hint: 'max-w-sm text-sm text-gray-500',
  },
});
