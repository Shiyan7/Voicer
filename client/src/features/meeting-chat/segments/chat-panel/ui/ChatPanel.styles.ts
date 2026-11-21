import { tv } from 'tailwind-variants';

export const chatPanelStyles = tv({
  slots: {
    root: `
      fixed z-[60] flex flex-col overflow-hidden rounded-3xl border
      border-gray-200 bg-white shadow-2xl shadow-black/10
      animate-chat-panel-in
    `,
    header: 'flex items-center justify-between gap-3 px-5 pb-2 pt-4',
    title: 'text-[17px] font-semibold tracking-title text-gray-900',
    headerActions: 'flex items-center gap-1',
    iconButton: `
      flex size-8 items-center justify-center rounded-full text-gray-500
      transition-colors hover:bg-gray-100 hover:text-gray-900
      disabled:pointer-events-none disabled:opacity-40
    `,
    body: 'flex flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-5 py-3',
    intro: 'flex flex-col gap-4 text-[15px] leading-relaxed text-gray-900',
    introIcon: `
      flex size-9 items-center justify-center rounded-full frost-surface
    `,
    hint: 'text-[15px] text-gray-600',
    footer: 'px-4 pb-4 pt-2',
  },
});
