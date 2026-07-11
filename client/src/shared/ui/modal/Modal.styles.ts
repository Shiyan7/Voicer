import { tv } from 'tailwind-variants';

export const modalStyles = tv({
  slots: {
    root: 'z-(--z-modal) fixed inset-0 sm:overflow-x-hidden text-center before:inline-block before:h-full before:align-middle',
    overlay:
      'bg-black/40 fixed inset-0 pointer-events-none transition-opacity duration-250',
    inner: `
      relative z-10 flex-col text-left sm:overflow-hidden
      w-full inline-flex mx-auto max-h-[90vh] sm:my-7
      rounded-none rounded-t-2xl sm:rounded-2xl align-bottom sm:align-middle
      border border-gray-200 bg-white shadow-xl
      overflow-y-auto sm:max-h-none
      transition-[opacity,translate,scale] ease-out duration-250
    `,
    close: `
      absolute z-2 right-2.5 top-2.5 flex size-6
      items-center justify-center rounded-md text-gray-500
      transition-colors hover:bg-gray-100 hover:text-gray-900
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
    opened: {
      true: {
        overlay: 'opacity-100',
        inner: 'opacity-100 translate-y-0 sm:scale-100 sm:translate-y-0',
      },
      false: {
        overlay: 'opacity-0',
        inner: 'opacity-0 translate-y-full sm:scale-[0.96] sm:translate-y-2',
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});
