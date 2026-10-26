import { tv } from 'tailwind-variants';

export const speakerAvatarStyles = tv({
  base: `
    flex size-6 shrink-0 items-center justify-center rounded-full
    text-[11px] font-semibold text-white ring-2 ring-white
  `,
  variants: {
    tone: {
      violet: 'bg-violet-500',
      amber: 'bg-amber-400',
      sky: 'bg-sky-500',
      rose: 'bg-rose-500',
      emerald: 'bg-emerald-500',
      stone: 'bg-stone-400',
    },
  },
});
