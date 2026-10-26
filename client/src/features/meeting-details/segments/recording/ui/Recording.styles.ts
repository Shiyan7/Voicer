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
      violet: { time: 'text-violet-500', body: 'border-violet-400' },
      amber: { time: 'text-amber-500', body: 'border-amber-400' },
      sky: { time: 'text-sky-500', body: 'border-sky-400' },
      rose: { time: 'text-rose-500', body: 'border-rose-400' },
      emerald: { time: 'text-emerald-500', body: 'border-emerald-400' },
      orange: { time: 'text-orange-500', body: 'border-orange-400' },
      teal: { time: 'text-teal-500', body: 'border-teal-400' },
      fuchsia: { time: 'text-fuchsia-500', body: 'border-fuchsia-400' },
      indigo: { time: 'text-indigo-500', body: 'border-indigo-400' },
      lime: { time: 'text-lime-500', body: 'border-lime-400' },
      cyan: { time: 'text-cyan-500', body: 'border-cyan-400' },
      stone: { time: 'text-stone-500', body: 'border-stone-400' },
    },
    active: {
      true: {
        paragraph: 'bg-gray-100 text-gray-900',
      },
    },
  },
});
