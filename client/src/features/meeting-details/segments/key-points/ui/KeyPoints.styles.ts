import { tv } from 'tailwind-variants';

export const keyPointsStyles = tv({
  slots: {
    card: 'rounded-2xl border border-black/5 bg-white p-5',
    sectionTitle: 'mb-3 text-sm font-semibold text-gray-900',
    list: 'flex flex-col gap-3',
    item: 'flex gap-3 text-sm leading-6 text-gray-700',
    bullet: 'mt-2 size-1.5 shrink-0 rounded-full bg-gray-300',
    text: 'min-w-0 flex-1',
    time: 'ml-1 text-xs tabular-nums text-gray-400',
  },
});
