import { tv } from 'tailwind-variants';

export const audioSettingsStyles = tv({
  slots: {
    trigger: `
      flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-full
      bg-gray-100 px-2 text-[13px] font-medium tabular-nums text-gray-600
      outline-none transition-colors duration-150 hover:bg-gray-200
      hover:text-gray-900
      focus-visible:ring-2 focus-visible:ring-gray-300
      disabled:pointer-events-none disabled:opacity-40
    `,
    panel: 'flex w-72 flex-col gap-4 p-4',
    row: 'flex items-center justify-between gap-3',
    section: 'flex flex-col gap-2',
    label: 'text-sm font-medium text-gray-900',
    value: 'text-[13px] font-medium tabular-nums text-gray-600',
    hint: 'text-xs text-gray-500',
    toggle: `
      relative h-6 w-10 shrink-0 rounded-full bg-gray-200 outline-none
      transition-colors duration-150
      focus-visible:ring-2 focus-visible:ring-gray-300
    `,
    knob: `
      absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm
      transition-transform duration-150
    `,
    reset: `
      self-start text-[13px] font-medium text-gray-500 outline-none
      transition-colors duration-150 hover:text-gray-900
      focus-visible:underline disabled:pointer-events-none disabled:opacity-40
    `,
  },
  variants: {
    active: {
      true: {
        trigger: 'text-gray-900',
        toggle: 'bg-gray-900',
        knob: 'translate-x-4',
      },
    },
  },
});
