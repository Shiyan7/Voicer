export const isModShortcut = (event: KeyboardEvent, code: string) =>
  (event.metaKey || event.ctrlKey) && event.code === code;
