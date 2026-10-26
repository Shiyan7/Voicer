import { tv } from 'tailwind-variants';

export const playerControlsStyles = tv({
  slots: {
    root: 'grid grid-cols-[1fr_auto_1fr] items-center',
    start: 'flex items-center',
    center: 'flex items-center gap-2',
    end: 'flex items-center justify-end gap-3',
    avatars: 'flex items-center -space-x-1.5',
    iconBtn: `
      flex size-9 items-center justify-center rounded-full text-gray-600
      outline-none transition-colors duration-150 hover:bg-gray-100
      hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-300
      disabled:pointer-events-none disabled:opacity-40
    `,
    playBtn: `
      flex size-10 items-center justify-center rounded-full bg-gray-900
      text-white outline-none transition-[background-color,transform]
      duration-150 hover:bg-gray-800 active:scale-95
      focus-visible:ring-2 focus-visible:ring-gray-400
      disabled:pointer-events-none disabled:opacity-40
    `,
    rateBtn: `
      w-12 rounded-full py-1 text-center text-[13px] font-medium
      tabular-nums text-gray-600 outline-none transition-colors
      duration-150 hover:bg-gray-100 hover:text-gray-900
    `,
  },
  variants: {
    active: {
      true: {
        iconBtn: 'bg-gray-100 text-gray-900',
      },
    },
  },
});
