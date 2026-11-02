import { tv } from 'tailwind-variants';

export const interviewBriefingStyles = tv({
  slots: {
    root: 'mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col gap-6 pt-6',
    header: 'flex items-center gap-4',
    title: 'text-2xl font-semibold tracking-title text-gray-900',
    status: 'animate-pulse text-[15px] text-gray-500',
    failed: 'flex items-center justify-between gap-3 text-[15px] text-red-600',
    section: 'flex flex-col gap-4',
    items: 'flex list-decimal flex-col gap-3 pl-6 marker:text-gray-400',
    item: 'pl-1 text-[15px] leading-relaxed text-gray-800',
    resume: 'flex flex-col items-start gap-2',
    vacancyText: `
      w-full whitespace-pre-wrap text-[15px] leading-relaxed text-gray-800
    `,
    vacancyToggle: `
      -mt-3 cursor-pointer self-center rounded-full border border-gray-200
      bg-white px-4 py-1.5 text-[13px] font-medium text-gray-800
      hover:border-gray-400
    `,
    resumePdf: 'block h-[85vh] w-full border-0',
    resumeLabel: 'text-[13px] font-medium text-gray-600',
    footer: 'sticky bottom-6 mt-auto flex justify-center pb-6 pt-2',
    chip: `
      flex max-w-80 cursor-pointer items-center gap-2.5 rounded-xl border-2 border-gray-200
      bg-white p-2 pr-3 text-left text-[13px] text-gray-800 transition-colors
      duration-200 hover:border-gray-400
    `,
    chipName: 'truncate',
    badge: `
      flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-400
      text-[11px] font-semibold text-white
    `,
    start: `
      min-h-13 bg-emerald-600 px-7 text-base font-semibold text-white
      hover:bg-emerald-700 active:bg-emerald-800
    `,
    skeleton: 'animate-pulse rounded-2xl bg-gray-100',
  },
  variants: {
    expanded: {
      false: { vacancyText: 'max-h-36 overflow-hidden' },
    },
    faded: {
      true: {
        vacancyText:
          '[mask-image:linear-gradient(to_bottom,black_55%,transparent)]',
      },
    },
    size: {
      header: { skeleton: 'h-16' },
      content: { skeleton: 'h-64' },
    },
  },
});
