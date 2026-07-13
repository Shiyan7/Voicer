import { tv } from 'tailwind-variants';

export const summaryStyles = tv({
  slots: {
    card: 'rounded-2xl border border-black/5 bg-white p-5 shadow-xs',
    sectionTitle: 'mb-3 text-sm font-semibold text-gray-900',
    summary: 'flex flex-col gap-2',
    heading: 'mt-1 text-sm font-semibold text-gray-900',
    paragraph: 'text-sm leading-6 text-gray-700',
    list: 'flex list-disc flex-col gap-1 pl-5 text-sm leading-6 text-gray-700',
    strong: 'font-semibold text-gray-900',
  },
});
