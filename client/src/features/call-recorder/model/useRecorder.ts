export function useRecorder() {
  const isBarVisible = (): boolean => false;

  const isUploading = (): boolean => false;

  const barText = (): string => '';

  const timeLabel = (): string => '';

  const uploadPercent = (): number => 0;

  const setup = () => {};

  const stop = () => {};

  return { isBarVisible, isUploading, barText, timeLabel, uploadPercent, setup, stop };
}
