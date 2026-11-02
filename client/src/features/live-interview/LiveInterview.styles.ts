import { tv } from 'tailwind-variants';

export const liveInterviewStyles = tv({
  slots: {
    mockPlaceholder: 'flex items-center gap-4 py-6 text-[15px] text-gray-600',
    root: 'flex w-full flex-col',
  },
});
