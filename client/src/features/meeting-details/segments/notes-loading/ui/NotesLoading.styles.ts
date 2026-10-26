import { tv } from 'tailwind-variants';

const shimmer = `
  animate-ai-shimmer bg-[length:300%_100%]
  bg-[linear-gradient(90deg,#f1f2f6,#e0e7ff,#ede9fe,#f1f2f6,#f1f2f6)]
`;

export const notesLoadingStyles = tv({
  slots: {
    root: 'relative flex flex-col gap-10 px-1 pt-2',
    head: 'flex items-center gap-3',
    badge: `
      flex size-10 shrink-0 animate-pulse items-center justify-center
      rounded-xl text-ai-foreground
      bg-[linear-gradient(135deg,#6366f1,#8b5cf6)]
      shadow-[0_8px_24px_-8px_rgba(99,102,241,0.55)]
    `,
    titleBox: 'flex flex-col',
    title: `
      animate-ai-shimmer bg-[length:300%_100%] bg-clip-text text-lg
      font-semibold text-transparent
      bg-[linear-gradient(90deg,#4f46e5,#7c3aed,#4f46e5,#7c3aed,#4f46e5)]
    `,
    description: 'text-sm text-gray-500',
    block: 'flex flex-col gap-3.5',
    heading: `h-5 w-40 rounded-full ${shimmer}`,
    row: 'flex items-center gap-3',
    dot: `size-5 shrink-0 rounded-full ${shimmer}`,
    bullet: `size-1.5 shrink-0 rounded-full ${shimmer}`,
    line: `h-3.5 rounded-full ${shimmer}`,
  },
  variants: {
    width: {
      full: { line: 'w-full' },
      long: { line: 'w-4/5' },
      medium: { line: 'w-3/5' },
      short: { line: 'w-2/5' },
    },
  },
});
