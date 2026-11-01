import { tv } from 'tailwind-variants';

export const markdownStyles = tv({
  slots: {
    root: 'flex flex-col gap-2',
    block: '',
    bold: 'font-semibold',
    code: `
      rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-[0.87em] text-gray-800
    `,
  },
  variants: {
    bullet: {
      true: {
        block: `
          relative pl-4 before:absolute before:left-1 before:top-[0.7em]
          before:size-1 before:rounded-full before:bg-gray-400
        `,
      },
    },
  },
});
