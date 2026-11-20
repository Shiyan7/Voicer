import { tv } from 'tailwind-variants';

export const chatComposerStyles = tv({
  slots: {
    root: 'flex flex-col gap-2',
    form: 'flex',
    inputBeam: `
      flex min-w-0 flex-1 items-end gap-2 bg-gray-100 p-2
      shadow-[inset_0_0_0_1px_rgb(0_0_0/0.04)]
    `,
    input: `
      block max-h-32 min-h-9 flex-1 resize-none bg-transparent py-1.5 pl-3.5
      text-[15px] leading-6 text-gray-900 outline-none
      placeholder:text-gray-500
    `,
    send: 'z-[4]',
    disclaimer: 'text-center text-[12px] text-gray-400',
  },
});
