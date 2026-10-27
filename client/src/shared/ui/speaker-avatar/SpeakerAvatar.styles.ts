import { tv } from 'tailwind-variants';

export const speakerAvatarStyles = tv({
  slots: {
    root: `
      flex shrink-0 items-center justify-center rounded-full
      ring-2 ring-white
    `,
    face: 'shrink-0',
  },
  variants: {
    size: {
      sm: { root: 'size-6', face: 'size-5' },
      md: { root: 'size-8', face: 'size-7' },
    },
    tone: {
      steel: { root: 'bg-speaker-steel-soft text-speaker-steel' },
      sage: { root: 'bg-speaker-sage-soft text-speaker-sage' },
      sand: { root: 'bg-speaker-sand-soft text-speaker-sand' },
      clay: { root: 'bg-speaker-clay-soft text-speaker-clay' },
      mauve: { root: 'bg-speaker-mauve-soft text-speaker-mauve' },
      slate: { root: 'bg-speaker-slate-soft text-speaker-slate' },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});
