import { tv } from 'tailwind-variants';

export const permissionsStyles = tv({
  slots: {
    rowActions: 'flex shrink-0 items-center gap-2',
    status: `
      flex items-center gap-1.5 text-[13px] text-gray-500
      before:size-2 before:rounded-full before:bg-gray-300
    `,
  },
  variants: {
    granted: {
      true: {
        status: 'text-gray-900 before:bg-green-500',
      },
      false: {
        status: 'before:bg-red-500',
      },
    },
  },
});
