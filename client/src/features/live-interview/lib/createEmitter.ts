export const createEmitter = <T>() => {
  const listeners = new Set<(value: T) => void>();

  const subscribe = (listener: (value: T) => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const emit = (value: T) => listeners.forEach((listener) => listener(value));

  return { subscribe, emit };
};
