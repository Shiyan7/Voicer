import { tv } from 'tailwind-variants';

export const notesEmptyStyles = tv({
  slots: {
    root: `
      relative flex flex-col items-center overflow-hidden rounded-3xl
      border border-black/5 bg-white px-6 pb-14 pt-16 text-center
    `,
    glow: `
      pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem]
      -translate-x-1/2 rounded-full opacity-60 blur-3xl
      bg-[radial-gradient(closest-side,rgba(168,85,247,0.35),rgba(236,72,153,0.18),transparent)]
    `,
    stack: 'relative mb-10 h-36 w-56',
    sheet: `
      absolute inset-x-6 top-4 flex flex-col gap-2.5 rounded-2xl border
      border-gray-200 bg-white p-4
      shadow-[0_12px_32px_-16px_rgba(15,15,30,0.25)]
    `,
    line: 'h-2 rounded-full bg-gray-100',
    accentLine: `
      h-2 w-[55%] rounded-full
      bg-[linear-gradient(90deg,#8b5cf6,#ec4899)] opacity-80
    `,
    check: 'flex items-center gap-2',
    checkBox: 'size-3 shrink-0 rounded-[4px] border-[1.5px] border-gray-300',
    badge: `
      absolute -right-1 -top-2 flex size-11 items-center justify-center
      rounded-2xl text-ai-foreground
      bg-[linear-gradient(135deg,#6366f1,#a855f7,#ec4899)]
      shadow-[0_8px_24px_-6px_rgba(168,85,247,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]
    `,
    title: 'relative text-lg font-semibold tracking-title text-gray-900',
    description: 'relative mt-2 max-w-sm text-sm leading-6 text-gray-500',
    hint: `
      relative mt-6 inline-flex items-center gap-1.5 rounded-full bg-gray-100
      px-3 py-1.5 text-[13px] font-medium text-gray-600
    `,
  },
  variants: {
    width: {
      medium: { line: 'w-[62%]' },
      long: { line: 'w-[80%]' },
      full: { line: 'w-[90%]' },
    },
    layer: {
      back: { sheet: '-rotate-6 translate-x-[-14px] opacity-60' },
      middle: { sheet: 'rotate-3 translate-x-[10px] opacity-80' },
      front: { sheet: 'translate-y-2' },
    },
  },
});
