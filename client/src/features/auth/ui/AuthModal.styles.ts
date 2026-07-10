import { tv } from 'tailwind-variants';

export const authModalStyles = tv({
  slots: {
    title: 'text-center leading-normal text-primary mb-4',
    form: 'flex flex-col gap-y-3 mb-4',
    row: 'flex items-center justify-between gap-1 text-xs',
    hint: 'text-gray',
    switch: 'text-main hover:text-main-hover transition',
    div: 'my-2.5 flex items-center gap-3',
    div_line: 'h-px flex-1 bg-white/10',
    div_txt: 'text-xs text-gray',
    social: 'flex items-center gap-2 mb-5',
    socialBtn: `
      flex items-center justify-center rounded-md
      w-full h-10 bg-surface-dark hover:bg-on-surface transition-colors
    `,
    footer: 'px-6 text-center text-xs leading-normal',
    link: `
      text-secondary hover:text-secondary-hover
      font-semibold transition
    `,
  },
});
