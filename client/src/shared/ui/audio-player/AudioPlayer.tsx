import { createSignal, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { formatSeconds } from '@/shared/lib/time';

import { audioPlayerStyles } from './AudioPlayer.styles';

export interface AudioPlayerApi {
  seek: (seconds: number, options?: { play?: boolean }) => void;
  pause: () => void;
}

interface AudioPlayerProps {
  src: string;
  class?: string;
  ref?: (api: AudioPlayerApi) => void;
  onTimeUpdate?: (seconds: number) => void;
}

const RATES = [1, 1.5, 2];

const styles = audioPlayerStyles();

export function AudioPlayer(props: AudioPlayerProps) {
  let audioEl!: HTMLAudioElement;
  let trackEl!: HTMLDivElement;

  const [isPlaying, setIsPlaying] = createSignal(false);
  const [currentTime, setCurrentTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [rate, setRate] = createSignal(RATES[0]);
  const [isDragging, setIsDragging] = createSignal(false);
  const [hasError, setHasError] = createSignal(false);

  const progress = () =>
    duration() > 0 ? Math.min(currentTime() / duration(), 1) : 0;

  const seek: AudioPlayerApi['seek'] = (seconds, options) => {
    const max = duration();
    const next = Math.max(0, max > 0 ? Math.min(seconds, max) : seconds);

    audioEl.currentTime = next;
    setCurrentTime(next);
    props.onTimeUpdate?.(next);

    if (options?.play) void audioEl.play();
  };

  props.ref?.({ seek, pause: () => audioEl.pause() });

  const togglePlay = () => {
    if (audioEl.paused) {
      void audioEl.play();
    } else {
      audioEl.pause();
    }
  };

  const cycleRate = () => {
    const next = RATES[(RATES.indexOf(rate()) + 1) % RATES.length];
    setRate(next);
    audioEl.playbackRate = next;
  };

  const syncTime = () => {
    if (isDragging()) return;
    setCurrentTime(audioEl.currentTime);
    props.onTimeUpdate?.(audioEl.currentTime);
  };

  const syncDuration = () => {
    setDuration(Number.isFinite(audioEl.duration) ? audioEl.duration : 0);
  };

  const timeFromPointer = (event: PointerEvent) => {
    const rect = trackEl.getBoundingClientRect();
    const ratio = Math.min(
      Math.max((event.clientX - rect.left) / rect.width, 0),
      1,
    );

    return ratio * duration();
  };

  const onTrackPointerDown = (event: PointerEvent) => {
    if (duration() <= 0) return;

    setIsDragging(true);
    trackEl.setPointerCapture(event.pointerId);
    seek(timeFromPointer(event));
  };

  const onTrackPointerMove = (event: PointerEvent) => {
    if (isDragging()) seek(timeFromPointer(event));
  };

  const onTrackPointerUp = () => setIsDragging(false);

  return (
    <div class={styles.root({ class: props.class })}>
      <audio
        ref={audioEl}
        preload="metadata"
        src={props.src}
        onDurationChange={syncDuration}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
        onLoadedMetadata={syncDuration}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={syncTime}
      />
      <button
        class={styles.playBtn()}
        aria-label={
          isPlaying() ? i18n.t('player.pause') : i18n.t('player.play')
        }
        disabled={hasError()}
        type="button"
        onClick={togglePlay}
      >
        <Show
          when={isPlaying()}
          fallback={
            <svg class={styles.playIcon()} viewBox="0 0 16 16">
              <path d="M5.3 2.84a.75.75 0 0 0-1.13.65v9.02c0 .58.63.94 1.13.65l7.69-4.51a.75.75 0 0 0 0-1.3L5.3 2.84Z" />
            </svg>
          }
        >
          <svg class={styles.playIcon()} viewBox="0 0 16 16">
            <rect height="10.5" rx="1.1" width="2.6" x="4" y="2.75" />
            <rect height="10.5" rx="1.1" width="2.6" x="9.4" y="2.75" />
          </svg>
        </Show>
      </button>
      <Show
        when={!hasError()}
        fallback={
          <span class={styles.message()}>
            {i18n.t('meetings.player_error')}
          </span>
        }
      >
        <span class={styles.time()}>{formatSeconds(currentTime())}</span>
        <div
          class={styles.track()}
          ref={trackEl}
          onPointerDown={onTrackPointerDown}
          onPointerMove={onTrackPointerMove}
          onPointerUp={onTrackPointerUp}
        >
          <div class={styles.trackRail()}>
            <div
              class={styles.trackFill()}
              style={{ width: `${progress() * 100}%` }}
            />
          </div>
          <div
            class={styles.thumb({ dragging: isDragging() })}
            style={{ left: `${progress() * 100}%` }}
          />
        </div>
        <span class={styles.time()}>{formatSeconds(duration())}</span>
        <button
          class={styles.rateBtn()}
          aria-label={i18n.t('player.speed')}
          type="button"
          onClick={cycleRate}
        >
          {rate()}x
        </button>
      </Show>
    </div>
  );
}
