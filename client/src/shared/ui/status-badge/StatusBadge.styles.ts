import { tv } from 'tailwind-variants';

export const statusBadgeStyles = tv({
  slots: {
    root: `
      inline-flex items-center gap-1.5 whitespace-nowrap
      rounded-full px-2.5 py-1 text-xs font-medium
    `,
    dot: 'size-1.5 shrink-0 rounded-full',
  },
  variants: {
    kind: {
      ready: {
        root: 'bg-gray-100 text-gray-500',
      },
      failed: {
        root: 'bg-red-500/10 text-red-600',
      },
      recording: {
        root: 'bg-red-500/10 text-red-600',
        dot: 'animate-pulse bg-red-500',
      },
      progress: {
        root: 'animate-pulse bg-gray-100 text-gray-600',
      },
    },
  },
  defaultVariants: {
    kind: 'ready',
  },
});
