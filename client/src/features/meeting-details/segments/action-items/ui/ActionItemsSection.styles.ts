import { tv } from 'tailwind-variants';

export const actionItemsSectionStyles = tv({
  slots: {
    card: 'rounded-2xl border border-black/5 bg-white p-5 shadow-xs',
    sectionTitle: 'mb-3 text-sm font-semibold text-gray-900',
  },
});
