import { tv } from 'tailwind-variants';

export const toolbarStyles = tv({
  slots: {
    root: 'flex items-center gap-3',
    uploadInput: 'hidden',
  },
});
