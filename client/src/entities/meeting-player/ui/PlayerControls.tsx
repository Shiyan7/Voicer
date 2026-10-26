import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';

import { PlayerControlsProps } from '../types/PlayerControlsProps';
import { playerControlsStyles } from './PlayerControls.styles';
import { SpeakerAvatar } from './SpeakerAvatar';

const styles = playerControlsStyles();

export function PlayerControls(props: PlayerControlsProps) {
  return (
    <div class={styles.root()}>
      <div class={styles.start()}>
        <Show when={props.hasTracks}>
          <button
            class={styles.iconBtn({ active: props.isSpeakersOpen })}
            aria-label={i18n.t('player.speakers')}
            type="button"
            onClick={props.onToggleSpeakers}
          >
            <Icon size={18} name="common:timeline" />
          </button>
        </Show>
      </div>
      <div class={styles.center()}>
        <button
          class={styles.iconBtn()}
          aria-label={i18n.t('player.back')}
          disabled={props.isDisabled}
          type="button"
          onClick={props.onSkipBack}
        >
          <Icon size={18} name="common:skip-back" />
        </button>
        <button
          class={styles.playBtn()}
          aria-label={props.playLabel}
          disabled={props.isDisabled}
          type="button"
          onClick={props.onTogglePlay}
        >
          <Show
            when={props.isPlaying}
            fallback={<Icon size={16} name="common:play" />}
          >
            <Icon size={16} name="common:pause" />
          </Show>
        </button>
        <button
          class={styles.iconBtn()}
          aria-label={i18n.t('player.forward')}
          disabled={props.isDisabled}
          type="button"
          onClick={props.onSkipForward}
        >
          <Icon size={18} name="common:skip-forward" />
        </button>
      </div>
      <div class={styles.end()}>
        <div class={styles.avatars()}>
          <For each={props.tracks}>
            {(track) => (
              <SpeakerAvatar tone={track.tone} initial={track.initial} />
            )}
          </For>
        </div>
        <button
          class={styles.rateBtn()}
          aria-label={i18n.t('player.speed')}
          type="button"
          onClick={props.onCycleRate}
        >
          {props.rateLabel}
        </button>
      </div>
    </div>
  );
}
