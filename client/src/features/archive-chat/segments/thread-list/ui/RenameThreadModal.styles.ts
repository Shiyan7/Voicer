import { tv } from 'tailwind-variants';

export const renameThreadModalStyles = tv({
  slots: {
    title: 'text-lg font-semibold text-gray-900',
    form: 'mt-4 flex flex-col',
    counter: 'mt-1.5 self-end text-[12px] tabular-nums text-gray-400',
    footer: 'mt-6 flex items-center justify-end gap-2',
  },
});
