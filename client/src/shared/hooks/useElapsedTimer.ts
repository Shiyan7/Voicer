import { createEffect, createSignal, on, onCleanup } from 'solid-js';

export const useElapsedTimer = () => {
  const [startedAt, setStartedAt] = createSignal<number | null>(null);
  const [pausedMs, setPausedMs] = createSignal(0);
  const [pausedAt, setPausedAt] = createSignal<number | null>(null);
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

  const isPaused = () => pausedAt() !== null;

  const elapsedSeconds = () => {
    const start = startedAt();
    if (start === null) return 0;
    const end = pausedAt() ?? now();
    return Math.max(0, (end - start - pausedMs()) / 1000);
  };

  const start = (startedAtMs: number, pausedTotalMs = 0, pausedAtMs: number | null = null) => {
    setPausedMs(pausedTotalMs);
    setPausedAt(pausedAtMs);
    setStartedAt(startedAtMs);
  };

  const setPause = (pausedTotalMs: number, pausedAtMs: number | null) => {
    setPausedMs(pausedTotalMs);
    setPausedAt(pausedAtMs);
    setNow(Date.now());
  };

  const stop = () => {
    setStartedAt(null);
    setPausedMs(0);
    setPausedAt(null);
  };

  return { isRunning, isPaused, elapsedSeconds, start, setPause, stop };
};
