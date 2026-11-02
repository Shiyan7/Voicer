import { tv } from 'tailwind-variants';

export const briefingVacancyStyles = tv({
  slots: {
    root: 'flex flex-col items-start gap-2',
    label: 'text-[13px] font-medium text-gray-600',
    text: 'w-full whitespace-pre-wrap text-[15px] leading-relaxed text-gray-800',
    toggle: `
      -mt-3 cursor-pointer self-center rounded-full border border-gray-200
      bg-white px-4 py-1.5 text-[13px] font-medium text-gray-800
      hover:border-gray-400
    `,
  },
  variants: {
    expanded: {
      false: { text: 'max-h-36 overflow-hidden' },
    },
    faded: {
      true: {
        text: '[mask-image:linear-gradient(to_bottom,black_55%,transparent)]',
      },
    },
  },
});
