import { tv } from 'tailwind-variants';

export const inputStyles = tv({
  slots: {
    root: 'flex flex-col gap-1',
    input: `
      w-full h-10 rounded-xl border bg-surface-dark px-3.5
      text-white placeholder:text-gray outline-none text-sm
    `,
    label: 'block text-sm',
    error: 'text-critical text-xs',
  },
  variants: {
    error: {
      true: {
        input: 'border-critical',
      },
      false: {
        input: 'border-transparent',
      },
    },
  },
});
