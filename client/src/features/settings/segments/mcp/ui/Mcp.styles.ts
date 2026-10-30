import { tv } from 'tailwind-variants';

export const mcpStyles = tv({
  slots: {
    form: 'flex items-center gap-2 px-5 py-4',
    nameInput: 'min-w-0 flex-1',
    created: 'flex flex-col gap-2 px-5 py-4',
    createdHint: 'text-[13px] text-gray-500',
    command: `
      break-all rounded-lg bg-gray-100 px-3 py-2
      font-mono text-[12px] text-gray-900 select-all
    `,
    createdActions: 'flex justify-end',
    revoke: 'shrink-0 text-critical hover:bg-critical/10',
  },
});
