import { tv } from 'tailwind-variants';

export const emptyStateStyles = tv({
  slots: {
    root: `
      relative flex flex-col items-center overflow-hidden rounded-3xl
      border border-gray-200 bg-white px-6 pb-14 pt-16 text-center
    `,
    glow: `
      pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem]
      -translate-x-1/2 rounded-full opacity-60 blur-3xl
      bg-[radial-gradient(closest-side,var(--glow-from),var(--glow-to),transparent)]
    `,
    stack: 'relative mb-6 w-60',
    illustration: 'block h-auto w-full select-none',
    badge: `
      absolute -right-1 -top-1 flex size-11 items-center justify-center
      rounded-2xl text-white
      bg-[linear-gradient(135deg,var(--accent-from),var(--accent-to))]
      shadow-[0_8px_24px_-6px_var(--glow-from),inset_0_1px_0_rgba(255,255,255,0.3)]
    `,
    title: 'relative text-lg font-semibold tracking-title text-gray-900',
    description: 'relative mt-2 max-w-sm text-sm leading-6 text-gray-500',
    hint: `
      relative mt-6 inline-flex items-center gap-1.5 rounded-full bg-gray-100
      px-3 py-1.5 text-[13px] font-medium text-gray-600
    `,
  },
  variants: {
    tone: {
      ai: {
        root: `
          [--accent-from:#8b5cf6] [--accent-to:#ec4899]
          [--glow-from:rgba(168,85,247,0.35)] [--glow-to:rgba(236,72,153,0.18)]
        `,
      },
      info: {
        root: `
          [--accent-from:#38bdf8] [--accent-to:#6366f1]
          [--glow-from:rgba(56,189,248,0.35)] [--glow-to:rgba(99,102,241,0.18)]
        `,
      },
    },
  },
});
