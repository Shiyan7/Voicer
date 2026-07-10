import { tv } from 'tailwind-variants';

export const activityBarStyles = tv({
  slots: {
    root: 'w-md absolute left-full top-0 h-full bg-white shadow-2xl',
    title: 'text-md p-4 text-gray-900',
  },
});
