import { InterviewMode } from '@schema';
import { tv } from 'tailwind-variants';

export const interviewPrepStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-3xl flex-col gap-6 py-6',
    header: 'flex items-center gap-4',
    title: 'text-2xl font-semibold tracking-title text-gray-900',
    modes: 'grid grid-cols-2 gap-3',
    form: 'flex flex-col gap-5',
    actions: 'flex items-end justify-between gap-3',
    submit: 'min-h-13 px-7 text-base font-semibold',
    field: 'flex flex-col gap-2',
    label: 'text-[13px] font-medium text-gray-600',
    textarea: `
      min-h-36 w-full resize-y rounded-xl border bg-white px-4 py-3 text-[15px]
      text-gray-900 outline-none placeholder:text-gray-500
      focus:border-gray-500
    `,
    language: `
      flex h-13 cursor-pointer items-center rounded-xl border border-gray-300
      bg-white px-4 text-[15px] text-gray-900 hover:border-gray-500
    `,
    languageValue: 'flex items-center gap-1.5',
    languageIcon: 'rotate-90 text-gray-500',
    languagePanel: 'left-0 right-auto',
    fieldError: 'text-[13px] text-red-600',
    error: 'text-[15px] text-red-600',
  },
  variants: {
    mode: {
      [InterviewMode.Mock]: {
        submit:
          'bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800',
      },
      [InterviewMode.Real]: {
        submit:
          'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800',
      },
    },
    invalid: {
      true: { textarea: 'border-red-500' },
      false: { textarea: 'border-gray-300' },
    },
  },
});
