import { tv } from 'tailwind-variants';

export const modalStyles = tv({
  slots: {
    root: 'z-(--z-modal) fixed inset-0 sm:overflow-x-hidden text-center before:inline-block before:h-full before:align-middle',
    overlay:
      'bg-overlay backdrop-blur-sm fixed inset-0 pointer-events-none transition-opacity duration-250',
    inner: `
      relative z-10 flex-col text-left sm:overflow-hidden
      w-full inline-flex mx-auto max-h-[90vh] sm:my-7
      rounded-none rounded-t-2xl sm:rounded-2xl align-bottom sm:align-middle
      bg-white overflow-y-auto sm:max-h-none
      transition-[opacity,translate,scale] ease-out duration-250
    `,
    close: `
      absolute z-2 right-3.5 top-3.5 flex size-7
      items-center justify-center rounded-full bg-gray-100 text-gray-500
      transition-colors hover:bg-gray-200 hover:text-gray-900
    `,
  },
  variants: {
    size: {
      sm: {
        inner: 'sm:max-w-sm px-6 py-7 pb-8',
      },
      regular: {
        inner: 'sm:max-w-md p-8',
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
