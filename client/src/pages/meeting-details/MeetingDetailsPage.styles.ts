import { tv } from 'tailwind-variants';

export const meetingDetailsStyles = tv({
  slots: {
    root: 'mx-auto flex w-full max-w-3xl flex-col gap-5 py-6',
    backLink: `
      inline-flex w-fit items-center gap-1 text-[13px] font-medium
      text-gray-500 transition-colors duration-150 hover:text-gray-900
    `,
    header: 'flex flex-col gap-1.5',
    titleRow: 'flex items-start justify-between gap-3',
    title: `
      min-w-0 cursor-text truncate rounded-md text-2xl font-semibold
      tracking-title text-gray-900 transition-opacity duration-150
      hover:opacity-70
    `,
    titleInput: `
      w-full rounded-md bg-transparent text-2xl font-semibold
      tracking-title text-gray-900 caret-gray-900 outline-none
    `,
    deleteBtn: 'shrink-0 text-gray-500 hover:text-red-600',
    metaRow: 'flex flex-wrap items-center gap-3 text-[13px] text-gray-500',
    card: 'rounded-2xl border border-black/5 bg-white p-5 shadow-xs',
    sectionTitle: 'mb-3 text-sm font-semibold text-gray-900',
    summary: 'flex flex-col gap-2',
    summaryHeading: 'mt-1 text-sm font-semibold text-gray-900',
    summaryParagraph: 'text-sm leading-6 text-gray-700',
    summaryList:
      'flex list-disc flex-col gap-1 pl-5 text-sm leading-6 text-gray-700',
    transcript: 'flex flex-col gap-0.5',
    segment: `
      flex w-full gap-4 rounded-xl px-3 py-2 text-left
      transition-colors duration-150 hover:bg-gray-100
    `,
    segmentHead: 'flex w-24 shrink-0 flex-col gap-0.5',
    segmentSpeaker: 'text-[13px] font-medium',
    segmentTime: 'text-xs tabular-nums text-gray-400',
    segmentText: 'min-w-0 flex-1 text-sm leading-6 text-gray-700',
    statePanel: `
      flex flex-col items-center gap-3 rounded-2xl border border-black/5
      bg-white px-6 py-14 text-center shadow-xs
    `,
    spinner: `
      size-8 animate-spin rounded-full border-2 border-gray-200
      border-t-gray-900
    `,
    stateHint: 'max-w-sm text-sm text-gray-500',
    skeleton: 'animate-pulse rounded-2xl bg-gray-100',
    notFound: 'flex flex-col items-start gap-4 py-10',
    notFoundTitle: 'text-xl font-semibold tracking-title text-gray-900',
    modalTitle: 'mb-2 pr-8 text-lg font-semibold tracking-title text-gray-900',
    modalText: 'mb-5 text-sm leading-6 text-gray-600',
    modalActions: 'flex justify-end gap-2',
  },
  variants: {
    active: {
      true: {
        segment: 'bg-gray-100',
      },
    },
    speaker: {
      me: {
        segmentSpeaker: 'text-gray-900',
      },
      other: {
        segmentSpeaker: 'text-gray-500',
      },
    },
  },
});
