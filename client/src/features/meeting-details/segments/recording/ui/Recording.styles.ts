import { tv } from 'tailwind-variants';

export const recordingStyles = tv({
  slots: {
    root: 'flex flex-col gap-4',
    card: 'rounded-2xl border border-black/5 bg-white px-6 py-5',
    hint: 'max-w-sm text-sm text-gray-500',
    list: 'flex flex-col gap-6',
    group: 'flex flex-col gap-2',
    head: `
      flex w-fit items-center gap-2.5 rounded-full pr-2 outline-none
      transition-opacity duration-150 hover:opacity-80
    `,
    speaker: 'text-sm font-semibold text-gray-900',
    time: 'text-sm font-medium tabular-nums',
    body: 'ml-4 flex flex-col gap-2 border-l-2 pl-5',
    paragraph: `
      -mx-2 rounded-lg px-2 py-0.5 text-left text-[15px] leading-7
      text-gray-800 transition-colors duration-150 hover:bg-gray-100
    `,
  },
  variants: {
    tone: {
      steel: { time: 'text-speaker-steel', body: 'border-speaker-steel' },
      sage: { time: 'text-speaker-sage', body: 'border-speaker-sage' },
      sand: { time: 'text-speaker-sand', body: 'border-speaker-sand' },
      clay: { time: 'text-speaker-clay', body: 'border-speaker-clay' },
      mauve: { time: 'text-speaker-mauve', body: 'border-speaker-mauve' },
      slate: { time: 'text-speaker-slate', body: 'border-speaker-slate' },
    },
    active: {
      true: {
        paragraph: 'bg-gray-100 text-gray-900',
      },
    },
    focused: {
      true: {
        paragraph: 'animate-focus-flash',
      },
    },
  },
});
