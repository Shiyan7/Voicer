import { tv } from 'tailwind-variants';

export const modalStyles = tv({
  slots: {
    root: 'z-(--z-modal) fixed inset-0 overflow-x-hidden',
    overlay: `
      bg-overlay fixed inset-0 pointer-events-none
      opacity-0 transition-opacity
      data-[opened=true]:opacity-100 duration-250
    `,
    inner: `
      relative z-10 flex-col text-left overflow-hidden
      transition-all ease-out duration-250
    `,
    close: `
      absolute z-2 right-2.5 top-2.5 flex size-6
      items-center justify-center rounded-md text-white/70
      transition-colors hover:bg-black/15 hover:text-white
    `,
  },
  variants: {
    size: {
      sm: {
        inner: 'sm:max-w-sm px-5 py-6 pb-7',
      },
      regular: {
        inner: 'sm:max-w-md p-7',
      },
    },
    variant: {
      default: {
        root: 'text-center before:inline-block before:h-full before:align-middle',
        inner: `
          w-full inline-flex mx-auto sm:my-7
          rounded-none rounded-t-2xl sm:rounded-2xl align-bottom sm:align-middle
          border-t-[1.5px] border-surface-border bg-surface-bg
          overflow-y-auto sm:max-h-none
          opacity-0 translate-y-full
          data-[opened=true]:opacity-100 data-[opened=true]:translate-y-0
          sm:opacity-0 sm:scale-[0.96] sm:translate-y-2
          sm:data-[opened=true]:opacity-100 sm:data-[opened=true]:scale-100
          sm:data-[opened=true]:translate-y-0
        `,
      },
      dock: {
        root: 'pointer-events-none flex items-end justify-center overflow-hidden',
        overlay: 'hidden',
        inner: `
          w-full pointer-events-auto flex mx-3 mb-8 rounded-2xl border border-white/8 bg-surface-bg
          opacity-0 translate-y-[140%] data-[opened=true]:opacity-100 data-[opened=true]:translate-y-0
        `,
      },
    },
  },
  defaultVariants: {
    size: 'sm',
    variant: 'default',
  },
});
