import { tv } from 'tailwind-variants';

export const actionItemStyles = tv({
  slots: {
    row: '-mx-2 flex items-start gap-3 rounded-lg px-2 py-1.5',
    checkbox: `
      mt-1 flex size-5 shrink-0 cursor-pointer items-center justify-center
      rounded-full border-[1.5px] border-gray-300 bg-transparent text-white
      transition-colors duration-150 outline-none
      hover:border-gray-500
      focus-visible:ring-2 focus-visible:ring-gray-500/60 focus-visible:ring-offset-1
    `,
    text: `
      min-w-0 flex-1 text-[15px] leading-7 text-gray-800
      transition-colors duration-150
    `,
    mention: `
      mr-1.5 rounded-md px-1.5 py-0.5 text-[14px] font-medium
      bg-gray-100 text-gray-700
    `,
    time: 'ml-1.5 text-[13px] tabular-nums text-gray-400',
  },
  variants: {
    focused: {
      true: { row: 'animate-focus-flash' },
    },
    done: {
      true: {
        checkbox: 'border-gray-900 bg-gray-900',
        text: 'text-gray-400 line-through',
      },
    },
    tone: {
      steel: { mention: 'bg-speaker-steel-soft text-speaker-steel' },
      sage: { mention: 'bg-speaker-sage-soft text-speaker-sage' },
      sand: { mention: 'bg-speaker-sand-soft text-speaker-sand' },
      clay: { mention: 'bg-speaker-clay-soft text-speaker-clay' },
      mauve: { mention: 'bg-speaker-mauve-soft text-speaker-mauve' },
      slate: { mention: 'bg-speaker-slate-soft text-speaker-slate' },
    },
  },
});
