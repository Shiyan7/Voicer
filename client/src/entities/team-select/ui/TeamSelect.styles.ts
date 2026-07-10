import { tv } from 'tailwind-variants';

export const teamSelectStyles = tv({
  slots: {
    avatarBtn: `
      mx-auto flex h-5 w-5 items-center justify-center
      rounded-sm border border-gray-500 text-gray-500
    `,
    info: 'flex flex-col items-start',
    name: 'text-2xl font-bold text-gray-900',
    email: 'text-sm text-gray-500',
    authBtn: 'w-full',
  },
});
