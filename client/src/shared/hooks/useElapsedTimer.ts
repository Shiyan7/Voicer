import { createEffect, createSignal, on, onCleanup } from 'solid-js';

export const useElapsedTimer = () => {
  const [startedAt, setStartedAt] = createSignal<number | null>(null);
  const [now, setNow] = createSignal(Date.now());

  createEffect(
    on(startedAt, (start) => {
      if (start === null) return;

      setNow(Date.now());
      const id = setInterval(() => setNow(Date.now()), 1000);
      onCleanup(() => clearInterval(id));
    }),
  );

  const isRunning = () => startedAt() !== null;

  const elapsedSeconds = () => {
    const start = startedAt();
    return start === null ? 0 : Math.max(0, (now() - start) / 1000);
  };

  const start = (startedAtMs: number) => setStartedAt(startedAtMs);

  const stop = () => setStartedAt(null);

  return { isRunning, elapsedSeconds, start, stop };
};
