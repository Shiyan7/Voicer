import { tv } from 'tailwind-variants';

export const authModalStyles = tv({
  slots: {
    title: 'text-center leading-normal text-gray-900 mb-4',
    form: 'flex flex-col gap-y-3 mb-4',
    row: 'flex items-center justify-between gap-1 text-xs',
    hint: 'text-gray-500',
    switch: 'text-blue-500 hover:text-blue-600 transition',
    div: 'my-2.5 flex items-center gap-3',
    div_line: 'h-px flex-1 bg-gray-200',
    div_txt: 'text-xs text-gray-500',
    social: 'flex items-center gap-2 mb-5',
    socialBtn: `
      flex items-center justify-center rounded-md
      w-full h-10 bg-gray-100 hover:bg-gray-200 transition-colors
    `,
    footer: 'px-6 text-center text-xs leading-normal text-gray-500',
    link: `
      text-blue-500 hover:text-blue-600
      font-semibold transition
    `,
  },
});
