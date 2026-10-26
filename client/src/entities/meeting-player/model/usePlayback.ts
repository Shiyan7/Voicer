import { createSignal } from 'solid-js';

import { PLAYBACK_RATES } from '../config/playerConfig';
import { PlaybackController } from '../types/PlaybackController';

export const usePlayback = (): PlaybackController => {
  let audioEl: HTMLAudioElement | undefined;

  const [isPlaying, setIsPlaying] = createSignal(false);
  const [currentTime, setCurrentTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [rate, setRate] = createSignal(PLAYBACK_RATES[0]);
  const [hasError, setHasError] = createSignal(false);

  const setAudioRef = (element: HTMLAudioElement) => {
    audioEl = element;
  };

  const seek = (seconds: number, options?: { play?: boolean }) => {
    if (!audioEl) return;

    const max = duration();
    const next = Math.max(0, max > 0 ? Math.min(seconds, max) : seconds);

    audioEl.currentTime = next;
    setCurrentTime(next);

    if (options?.play) void audioEl.play();
  };

  const togglePlay = () => {
    if (!audioEl) return;

    if (audioEl.paused) {
      void audioEl.play();
    } else {
      audioEl.pause();
    }
  };

  const skip = (seconds: number) => seek(currentTime() + seconds);

  const cycleRate = () => {
    const next =
      PLAYBACK_RATES[
        (PLAYBACK_RATES.indexOf(rate()) + 1) % PLAYBACK_RATES.length
      ];
    setRate(next);
    if (audioEl) audioEl.playbackRate = next;
  };

  const onTimeUpdate = () => {
    if (audioEl) setCurrentTime(audioEl.currentTime);
  };

  const onDurationChange = () => {
    if (!audioEl) return;
    setDuration(Number.isFinite(audioEl.duration) ? audioEl.duration : 0);
  };

  return {
    isPlaying,
    currentTime,
    duration,
    rate,
    hasError,
    setAudioRef,
    togglePlay,
    skip,
    seek,
    cycleRate,
    onPlay: () => setIsPlaying(true),
    onPause: () => setIsPlaying(false),
    onTimeUpdate,
    onDurationChange,
    onError: () => setHasError(true),
  };
};
