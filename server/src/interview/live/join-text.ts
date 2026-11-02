export const joinText = (...parts: string[]): string =>
  parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ');
