import { tv } from 'tailwind-variants';

export const mockInterviewStyles = tv({
  slots: {
    root: 'flex w-full flex-col gap-6 py-6',
    bar: 'flex items-center gap-4',
    status: 'text-[15px] text-gray-600',
    spacer: 'flex-1',
    question: 'text-[22px] font-semibold text-gray-900',
    answer: 'text-[16px] text-gray-700',
    placeholder: 'text-[16px] text-gray-500',
  },
});
