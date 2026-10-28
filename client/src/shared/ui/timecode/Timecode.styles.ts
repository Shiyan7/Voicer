import { tv } from 'tailwind-variants';

export const timecodeStyles = tv({
  base: `
    mx-0.5 inline-flex items-center gap-1 rounded-md bg-gray-100 px-1.5
    align-[0.05em] text-[12px] font-medium leading-5 text-gray-600
    tabular-nums transition-colors hover:bg-gray-200 hover:text-gray-900
  `,
});
