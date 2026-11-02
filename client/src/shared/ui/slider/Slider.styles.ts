import { tv } from 'tailwind-variants';

export const sliderStyles = tv({
  slots: {
    root: 'group relative flex h-5 w-full items-center',
    track: 'absolute inset-x-0 h-1 overflow-hidden rounded-full bg-gray-200',
    fill: 'h-full rounded-full bg-gray-900',
    mark: 'absolute size-1 -translate-x-1/2 rounded-full bg-gray-400',
    thumb: `
      pointer-events-none absolute size-4 -translate-x-1/2 rounded-full
      bg-gray-900 ring-2 ring-white transition-transform duration-150
      group-hover:scale-110 group-active:scale-125
      peer-focus-visible:ring-gray-400
    `,
    input: `
      peer absolute inset-0 z-10 m-0 w-full cursor-pointer opacity-0
      disabled:cursor-not-allowed
    `,
  },
});
