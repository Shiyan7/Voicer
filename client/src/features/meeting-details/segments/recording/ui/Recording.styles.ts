import { tv } from 'tailwind-variants';

export const recordingStyles = tv({
  slots: {
    root: 'flex flex-col gap-4',
    card: 'rounded-2xl border border-black/5 bg-white p-5 shadow-xs',
    hint: 'max-w-sm text-sm text-gray-500',
    list: 'flex flex-col gap-0.5',
    segment: `
      flex w-full gap-4 rounded-xl px-3 py-2 text-left
      transition-colors duration-150 hover:bg-gray-100
    `,
    segmentHead: 'flex w-24 shrink-0 flex-col gap-0.5',
    segmentSpeaker: 'text-[13px] font-medium',
    segmentTime: 'text-xs tabular-nums text-gray-400',
    segmentText: 'min-w-0 flex-1 text-sm leading-6 text-gray-700',
  },
  variants: {
    active: {
      true: {
        segment: 'bg-gray-100',
      },
    },
    speaker: {
      me: {
        segmentSpeaker: 'text-gray-900',
      },
      other: {
        segmentSpeaker: 'text-gray-500',
      },
    },
  },
});
