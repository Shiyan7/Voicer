import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';
import { Popover } from '@/shared/ui/popover';
import { Slider } from '@/shared/ui/slider';
import { Tabs } from '@/shared/ui/tabs';

import {
  AUDIO_PRESETS,
  VOLUME_DEFAULT,
  VOLUME_MAX,
  VOLUME_SNAP_RANGE,
  VOLUME_STEP,
} from '../config/playerConfig';
import { AudioSettingsProps } from '../types/AudioSettingsProps';
import { audioSettingsStyles } from './AudioSettings.styles';

const styles = audioSettingsStyles();

const snapVolume = (percent: number) =>
  Math.abs(percent - VOLUME_DEFAULT) <= VOLUME_SNAP_RANGE
    ? VOLUME_DEFAULT
    : percent;

export function AudioSettings(props: AudioSettingsProps) {
  const presetTabs = () =>
    AUDIO_PRESETS.map((preset) => ({
      value: preset,
      label: i18n.t(`player.preset_${preset}`),
    }));

  const isBoosted = () => props.volume !== VOLUME_DEFAULT;

  return (
    <Popover
      ariaLabel={i18n.t('player.audio_settings')}
      disabled={props.isDisabled}
      panelClass={styles.panel()}
      placement="top-start"
      trigger={
        <>
          <Icon size={18} name="common:adjustments" />
          <Show when={isBoosted()}>{props.volume}%</Show>
        </>
      }
      triggerClass={(opened) =>
        styles.trigger({ active: opened || props.isChanged })
      }
    >
      <div class={styles.section()}>
        <div class={styles.row()}>
          <span class={styles.label()}>{i18n.t('player.volume')}</span>
          <span class={styles.value()}>{props.volume}%</span>
        </div>
        <Slider
          ariaLabel={i18n.t('player.volume')}
          mark={VOLUME_DEFAULT}
          max={VOLUME_MAX}
          step={VOLUME_STEP}
          value={props.volume}
          onChange={(percent) => props.onVolumeChange(snapVolume(percent))}
        />
      </div>
      <div class={styles.section()}>
        <span class={styles.label()}>{i18n.t('player.sound')}</span>
        <Tabs
          tabs={presetTabs()}
          activeTab={props.preset}
          onSelect={props.onPresetChange}
        />
        <span class={styles.hint()}>
          {i18n.t(`player.preset_${props.preset}_hint`)}
        </span>
      </div>
      <div class={styles.row()}>
        <span class={styles.label()}>{i18n.t('player.leveling')}</span>
        <button
          class={styles.toggle({ active: props.isLeveling })}
          aria-checked={props.isLeveling}
          aria-label={i18n.t('player.leveling')}
          role="switch"
          type="button"
          onClick={props.onToggleLeveling}
        >
          <span class={styles.knob({ active: props.isLeveling })} />
        </button>
      </div>
      <button
        class={styles.reset()}
        disabled={!props.isChanged}
        type="button"
        onClick={props.onReset}
      >
        {i18n.t('player.reset_audio')}
      </button>
    </Popover>
  );
}
