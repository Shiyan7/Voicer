import { tv } from 'tailwind-variants';

export const meetingDetailsStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-3xl flex-col gap-5 py-6',
    backLink: `
      inline-flex w-fit items-center gap-1 text-[13px] font-medium
      text-gray-500 transition-colors duration-150 hover:text-gray-900
    `,
    skeleton: 'animate-pulse rounded-2xl bg-gray-100',
    notFound: 'flex flex-col items-start gap-4 py-10',
    notFoundTitle: 'text-xl font-semibold tracking-title text-gray-900',
  },
  variants: {
    size: {
      header: {
        skeleton: 'h-16',
      },
      content: {
        skeleton: 'h-64',
      },
    },
  },
});
