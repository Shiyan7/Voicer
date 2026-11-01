const pad = (value: number) => String(value).padStart(2, '0');

export const formatElapsed = (seconds: number): string =>
  `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
