import { onMount } from 'solid-js';

export const useRecorder = () => {
  const isBarVisible = () => false;

  const isUploading = () => false;

  const barText = () => '';

  const timeLabel = () => '';

  const uploadPercent = () => 0;

  const setup = () => {};

  const stop = () => {};

  onMount(() => setup());

  return {
    isBarVisible,
    isUploading,
    barText,
    timeLabel,
    uploadPercent,
    setup,
    stop,
  };
};
