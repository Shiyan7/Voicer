import { tv } from 'tailwind-variants';

export const chatPanelStyles = tv({
  slots: {
    root: `
      fixed z-[60] flex flex-col overflow-hidden rounded-3xl border
      border-gray-200 bg-white shadow-2xl shadow-black/10
      animate-[chat-panel-in_220ms_cubic-bezier(0.22,1,0.36,1)]
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
    footer: 'flex flex-col gap-2 px-4 pb-4 pt-2',
    disclaimer: 'text-center text-[12px] text-gray-400',
    form: 'flex items-end gap-2',
    input: `
      max-h-32 min-h-11 flex-1 resize-none rounded-[22px] bg-gray-100 px-4
      py-2.5 text-[15px] leading-6 text-gray-900 outline-none
      placeholder:text-gray-500 focus:ring-2 focus:ring-sky-400/40
    `,
    send: `
      flex size-11 shrink-0 items-center justify-center rounded-full
      bg-gray-900 text-white transition-[opacity,transform] active:scale-95
      disabled:opacity-25
    `,
  },
});
