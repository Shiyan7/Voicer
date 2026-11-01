import { tv } from 'tailwind-variants';

export const interviewPrepStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-3xl flex-col gap-6 py-6',
    header: 'flex items-start gap-4',
    title: 'text-2xl font-semibold tracking-title text-gray-900',
    subtitle: 'text-[15px] text-gray-500',
    card: 'flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5',
    label: 'text-[13px] font-medium text-gray-600',
    textarea: `
      min-h-36 w-full resize-y rounded-lg border border-gray-300 bg-white
      px-3.5 py-3 text-[15px] text-gray-900 outline-none
      placeholder:text-gray-500 focus:border-gray-500
    `,
    actions: 'flex justify-end',
    loading: 'animate-pulse text-[15px] text-gray-500',
    error: 'text-[15px] text-red-600',
    section: 'flex flex-col gap-4 rounded-2xl bg-gray-50 p-4',
    items: 'flex list-decimal flex-col gap-3 pl-6 marker:text-gray-400',
    item: 'pl-1 text-[15px] leading-relaxed text-gray-800',
    start: 'self-center',
  },
});
