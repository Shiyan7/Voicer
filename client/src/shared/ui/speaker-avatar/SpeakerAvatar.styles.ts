import { tv } from 'tailwind-variants';

export const speakerAvatarStyles = tv({
  slots: {
    root: `
      flex shrink-0 items-center justify-center rounded-full ring-2
      ring-white
    `,
    face: 'shrink-0',
  },
  variants: {
    size: {
      sm: { root: 'size-6', face: 'size-5' },
      md: { root: 'size-8', face: 'size-7' },
    },
    tone: {
      violet: { root: 'bg-violet-200 text-violet-400' },
      amber: { root: 'bg-amber-200 text-amber-400' },
      sky: { root: 'bg-sky-200 text-sky-400' },
      rose: { root: 'bg-rose-200 text-rose-400' },
      emerald: { root: 'bg-emerald-200 text-emerald-400' },
      orange: { root: 'bg-orange-200 text-orange-400' },
      teal: { root: 'bg-teal-200 text-teal-400' },
      fuchsia: { root: 'bg-fuchsia-200 text-fuchsia-400' },
      indigo: { root: 'bg-indigo-200 text-indigo-400' },
      lime: { root: 'bg-lime-200 text-lime-400' },
      cyan: { root: 'bg-cyan-200 text-cyan-400' },
      stone: { root: 'bg-stone-200 text-stone-400' },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});
