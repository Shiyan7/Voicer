import { tv } from 'tailwind-variants';

export const chatThinkingStyles = tv({
  slots: {
    root: 'flex items-center gap-2.5 text-[14px] text-gray-500',
    spinner: 'size-4 shrink-0 animate-[spin_1.4s_linear_infinite]',
    track: `
      fill-none stroke-current stroke-[5] [stroke-linecap:round]
      animate-[spinner-dash_1.4s_ease-in-out_infinite]
    `,
  },
});
