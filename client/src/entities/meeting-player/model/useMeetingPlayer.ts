import { createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { formatClock } from '@/shared/lib/time';

import { SKIP_SECONDS } from '../config/playerConfig';
import { buildSpeakerTracks } from '../lib/buildSpeakerTracks';
import { MeetingPlayerDeps } from '../types/MeetingPlayerDeps';

export const useMeetingPlayer = (props: MeetingPlayerDeps) => {
  let trackEl: HTMLDivElement | undefined;

  const [isDragging, setIsDragging] = createSignal(false);
  const [isSpeakersOpen, setIsSpeakersOpen] = createSignal(true);

  const playback = () => props.playback;

  const progress = () => {
    const duration = playback().duration();
    return duration > 0 ? Math.min(playback().currentTime() / duration, 1) : 0;
  };

  const progressPercent = () => `${progress() * 100}%`;

  const currentLabel = () => formatClock(playback().currentTime());

  const durationLabel = () => formatClock(playback().duration());

  const rateLabel = () => `${playback().rate()}x`;

  const playLabel = () =>
    playback().isPlaying() ? i18n.t('player.pause') : i18n.t('player.play');

  const tracks = () =>
    buildSpeakerTracks(props.transcript, playback().duration() * 1000);

  const hasTracks = () => tracks().length > 0;

  const showSpeakers = () => hasTracks() && isSpeakersOpen();

  const setTrackRef = (element: HTMLDivElement) => {
    trackEl = element;
  };

  const timeFromPointer = (event: PointerEvent) => {
    if (!trackEl) return 0;

    const rect = trackEl.getBoundingClientRect();
    const ratio = Math.min(
      Math.max((event.clientX - rect.left) / rect.width, 0),
      1,
    );

    return ratio * playback().duration();
  };

  const onTrackPointerDown = (event: PointerEvent) => {
    if (!trackEl || playback().duration() <= 0) return;

    setIsDragging(true);
    trackEl.setPointerCapture(event.pointerId);
    playback().seek(timeFromPointer(event));
  };

  const onTrackPointerMove = (event: PointerEvent) => {
    if (isDragging()) playback().seek(timeFromPointer(event));
  };

  const onTrackPointerUp = () => setIsDragging(false);

  const skipBack = () => playback().skip(-SKIP_SECONDS);

  const skipForward = () => playback().skip(SKIP_SECONDS);

  const seekToMs = (ms: number) => playback().seek(ms / 1000, { play: true });

  const toggleSpeakers = () => setIsSpeakersOpen((open) => !open);

  return {
    isSpeakersOpen,
    showSpeakers,
    progressPercent,
    currentLabel,
    durationLabel,
    rateLabel,
    playLabel,
    tracks,
    hasTracks,
    setTrackRef,
    onTrackPointerDown,
    onTrackPointerMove,
    onTrackPointerUp,
    skipBack,
    skipForward,
    seekToMs,
    toggleSpeakers,
  };
};
