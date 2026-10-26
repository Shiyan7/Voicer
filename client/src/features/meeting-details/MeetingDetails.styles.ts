import { tv } from 'tailwind-variants';

export const meetingDetailsStyles = tv({
  slots: {
    page: 'flex min-h-[calc(100vh-1rem)] flex-col',
    root: 'mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5 pt-6 pb-10',
    headerRow: 'flex items-start justify-between gap-4',
    headerActions: 'flex shrink-0 items-center gap-2',
    tabPanel: 'flex flex-col gap-5',
    backLink: `
      inline-flex w-fit items-center gap-1 text-[13px] font-medium
      text-gray-500 transition-colors duration-150 hover:text-gray-900
    `,
    skeleton: 'animate-pulse rounded-2xl bg-gray-100',
    processing: `
      flex flex-col items-center justify-center gap-3 rounded-2xl
      bg-gray-100 py-16
    `,
    processingSpinner: `
      size-6 animate-spin rounded-full border-2 border-gray-300
      border-t-gray-900
    `,
    processingLabel: 'text-[13px] font-medium text-gray-500',
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
