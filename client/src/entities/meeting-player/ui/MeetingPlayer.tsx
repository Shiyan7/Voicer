import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { useMeetingPlayer } from '../model/useMeetingPlayer';
import { MeetingPlayerDeps } from '../types/MeetingPlayerDeps';
import { meetingPlayerStyles } from './MeetingPlayer.styles';
import { PlayerControls } from './PlayerControls';
import { PlayerTimeline } from './PlayerTimeline';
import { SpeakerTracks } from './SpeakerTracks';

const styles = meetingPlayerStyles();

export function MeetingPlayer(props: MeetingPlayerDeps) {
  const vm = useMeetingPlayer(props);

  return (
    <section class={styles.root()}>
      <audio
        ref={props.playback.setAudioRef}
        preload="metadata"
        src={props.audioUrl}
        onDurationChange={props.playback.onDurationChange}
        onEnded={props.playback.onPause}
        onError={props.playback.onError}
        onLoadedMetadata={props.playback.onDurationChange}
        onPause={props.playback.onPause}
        onPlay={props.playback.onPlay}
        onTimeUpdate={props.playback.onTimeUpdate}
      />
      <PlayerControls
        isPlaying={props.playback.isPlaying()}
        isDisabled={props.playback.hasError()}
        isSpeakersOpen={vm.isSpeakersOpen()}
        hasTracks={vm.hasTracks()}
        playLabel={vm.playLabel()}
        rateLabel={vm.rateLabel()}
        tracks={vm.tracks()}
        onTogglePlay={props.playback.togglePlay}
        onSkipBack={vm.skipBack}
        onSkipForward={vm.skipForward}
        onCycleRate={props.playback.cycleRate}
        onToggleSpeakers={vm.toggleSpeakers}
      />
      <Show
        when={!props.playback.hasError()}
        fallback={
          <p class={styles.message()}>{i18n.t('meetings.player_error')}</p>
        }
      >
        <PlayerTimeline
          currentLabel={vm.currentLabel()}
          durationLabel={vm.durationLabel()}
          progressPercent={vm.progressPercent()}
          setTrackRef={vm.setTrackRef}
          onPointerDown={vm.onTrackPointerDown}
          onPointerMove={vm.onTrackPointerMove}
          onPointerUp={vm.onTrackPointerUp}
        />
        <Show when={vm.showSpeakers()}>
          <SpeakerTracks tracks={vm.tracks()} onSeek={vm.seekToMs} />
        </Show>
      </Show>
    </section>
  );
}
