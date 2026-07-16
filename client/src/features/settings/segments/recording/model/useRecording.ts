export function useRecording() {
  const autoRecord = (): boolean => false;

  const toggleAutoRecord = () => {};

  return { autoRecord, toggleAutoRecord };
}
