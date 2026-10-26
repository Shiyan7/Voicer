import { tv } from 'tailwind-variants';

export const meetingPlayerStyles = tv({
  slots: {
    root: `
      sticky bottom-0 z-40 -mx-7 -mb-2 flex flex-col gap-3 border-t
      border-gray-200 bg-white/90 px-7 pb-5 pt-3 backdrop-blur-xl
    `,
    message: 'text-center text-sm text-gray-500',
  },
});
