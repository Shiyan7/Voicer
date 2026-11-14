import { tv } from 'tailwind-variants';

export const liveTurnCardStyles = tv({
  slots: {
    root: 'flex min-w-0 flex-col gap-4',
    question: `
      flex max-w-[90%] flex-col gap-3 self-start rounded-2xl rounded-bl-md bg-gray-100 px-5 py-3.5
      text-[22px] leading-snug text-gray-900
    `,
    thumb: `
      block w-72 max-w-full overflow-hidden rounded-xl border border-gray-200
      bg-white transition-shadow hover:shadow-md
      outline-none focus-visible:ring-2 focus-visible:ring-gray-500/60
    `,
    thumbImage: 'aspect-video w-full object-cover object-top',
    answer: 'flex min-w-0 flex-col gap-4',
    short: 'text-[26px] font-medium leading-snug text-gray-900',
    toggle: 'self-start',
    details: 'text-[20px] leading-relaxed text-gray-700',
    cursor:
      'ml-1 inline-block h-[1em] w-0.5 animate-pulse bg-current align-middle',
  },
  variants: {
    live: {
      true: { question: 'text-gray-500' },
    },
  },
});
