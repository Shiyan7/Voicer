import { tv } from 'tailwind-variants';

export const authModalStyles = tv({
  slots: {
    title: `
      text-center text-[22px] font-semibold tracking-title
      leading-snug text-gray-900 mb-6
    `,
    form: 'flex flex-col gap-3 mb-4',
    error: 'text-xs text-red-500',
    row: 'flex items-center justify-between gap-2 text-[13px]',
    hint: 'text-gray-500',
    switch: `
      font-medium text-gray-900 underline-offset-2
      hover:underline transition
    `,
    div: 'my-5 flex items-center gap-4',
    divLine: 'h-px flex-1 bg-gray-200',
    divTxt: 'text-xs text-gray-500',
    social: 'flex items-center gap-2.5 mb-6',
    socialBtn: `
      flex items-center justify-center w-full h-12
      rounded-xl bg-gray-100 text-gray-900
      outline-none focus-visible:ring-2 focus-visible:ring-gray-500/60
      transition-colors hover:bg-gray-200 active:bg-gray-300
    `,
    footer: 'px-4 text-center text-xs leading-relaxed text-gray-400',
    link: `
      font-medium text-gray-500 underline-offset-2
      hover:text-gray-900 hover:underline transition
    `,
  },
});
