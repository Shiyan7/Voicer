import { tv } from 'tailwind-variants';

export const callPromptToastStyles = tv({
  slots: {
    root: `
      fixed bottom-6 left-1/2 z-(--z-toast) -translate-x-1/2
      flex items-center gap-4 px-5 py-3.5
      rounded-2xl border border-black/5
      bg-white/85 backdrop-blur-xl shadow-lg
    `,
    dot: 'size-2 shrink-0 animate-pulse rounded-full bg-red-500',
    message: 'text-sm font-medium text-gray-900',
    actions: 'flex shrink-0 items-center gap-2',
  },
});
