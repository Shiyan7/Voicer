import { InterviewMode } from '@schema';
import { tv } from 'tailwind-variants';

export const prepModeCardStyles = tv({
  slots: {
    card: `
      flex w-full cursor-pointer flex-col items-start gap-1 rounded-2xl border-2
      bg-white p-4 text-left text-gray-900 transition-colors duration-200
    `,
    icon: `
      mb-2 flex size-10 items-center justify-center rounded-full
    `,
    title: 'text-[15px] font-semibold',
    description: 'text-[13px] leading-snug text-gray-500',
  },
  variants: {
    mode: {
      [InterviewMode.Mock]: { icon: 'bg-violet-100 text-violet-600' },
      [InterviewMode.Real]: { icon: 'bg-emerald-100 text-emerald-600' },
    },
    selected: {
      true: {},
      false: { card: 'border-gray-200 hover:border-gray-400' },
    },
  },
  compoundVariants: [
    {
      mode: InterviewMode.Mock,
      selected: true,
      class: { card: 'border-violet-600' },
    },
    {
      mode: InterviewMode.Real,
      selected: true,
      class: { card: 'border-emerald-600' },
    },
  ],
});
