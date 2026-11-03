import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { useMeetingPlayer } from '../model/useMeetingPlayer';
import { MeetingPlayerDeps } from '../types/MeetingPlayerDeps';
import { AudioSettings } from './AudioSettings';
import { meetingPlayerStyles } from './MeetingPlayer.styles';
import { PlayerControls } from './PlayerControls';
import { PlayerTimeline } from './PlayerTimeline';
import { SpeakerTracks } from './SpeakerTracks';

const styles = meetingPlayerStyles();

export function MeetingPlayer(deps: MeetingPlayerDeps) {
  const vm = useMeetingPlayer(deps);

  return (
    <section class={styles.root()} ref={deps.rootRef}>
      <audio
        ref={deps.playback.setAudioRef}
        crossorigin="anonymous"
        preload="metadata"
        src={deps.audioUrl}
        onDurationChange={deps.playback.onDurationChange}
        onEnded={deps.playback.onPause}
        onError={deps.playback.onError}
        onLoadedMetadata={deps.playback.onDurationChange}
        onPause={deps.playback.onPause}
        onPlay={deps.playback.onPlay}
        onTimeUpdate={deps.playback.onTimeUpdate}
      />
      <PlayerControls
        isPlaying={deps.playback.isPlaying()}
        isDisabled={deps.playback.hasError()}
        isSpeakersOpen={vm.isSpeakersOpen()}
        hasTracks={vm.hasTracks()}
        playLabel={vm.playLabel()}
        rateLabel={vm.rateLabel()}
        audioSettings={
          <AudioSettings
            volume={deps.playback.volume()}
            preset={deps.playback.audioPreset()}
            isLeveling={deps.playback.isLeveling()}
            isChanged={deps.playback.isAudioChanged()}
            isDisabled={deps.playback.hasError()}
            onVolumeChange={deps.playback.setVolume}
            onPresetChange={deps.playback.setAudioPreset}
            onToggleLeveling={deps.playback.toggleLeveling}
            onReset={deps.playback.resetAudio}
          />
        }
        tracks={vm.tracks()}
        onTogglePlay={deps.playback.togglePlay}
        onSkipBack={vm.skipBack}
        onSkipForward={vm.skipForward}
        onCycleRate={deps.playback.cycleRate}
        onToggleSpeakers={vm.toggleSpeakers}
      />
      <Show
        when={!deps.playback.hasError()}
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
