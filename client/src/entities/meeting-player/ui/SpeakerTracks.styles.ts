import { tv } from 'tailwind-variants';

export const speakerTracksStyles = tv({
  slots: {
    root: 'grid grid-cols-[3rem_1fr_3rem] gap-x-3 gap-y-2',
    avatarCell: 'flex items-end justify-center pb-px',
    body: 'flex min-w-0 flex-col gap-1',
    label: 'truncate text-xs font-medium text-gray-700',
    rail: 'relative h-1.5 w-full rounded-full bg-gray-100',
    range: `
      absolute inset-y-0 min-w-0.5 rounded-full transition-opacity
      duration-150 hover:opacity-70
    `,
    share: 'self-end text-right text-xs tabular-nums text-gray-500',
  },
  variants: {
    tone: {
      steel: { range: 'bg-speaker-steel' },
      sage: { range: 'bg-speaker-sage' },
      sand: { range: 'bg-speaker-sand' },
      clay: { range: 'bg-speaker-clay' },
      mauve: { range: 'bg-speaker-mauve' },
      slate: { range: 'bg-speaker-slate' },
    },
  },
});
