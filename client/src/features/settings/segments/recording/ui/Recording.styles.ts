import { tv } from 'tailwind-variants';

export const recordingStyles = tv({
  slots: {
    toggle: `
      relative h-7 w-12 shrink-0 rounded-full bg-gray-300
      transition-colors duration-200
      outline-none focus-visible:ring-2 focus-visible:ring-gray-500/60
      focus-visible:ring-offset-2
    `,
    toggleThumb: `
      absolute left-0.5 top-0.5 size-6 rounded-full
      bg-white shadow-sm transition-transform duration-200
    `,
  },
  variants: {
    checked: {
      true: {
        toggle: 'bg-gray-900',
        toggleThumb: 'translate-x-5',
      },
    },
  },
});
