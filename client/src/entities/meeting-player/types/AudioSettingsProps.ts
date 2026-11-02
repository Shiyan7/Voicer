import { AudioPreset } from './AudioPreset';

export interface AudioSettingsProps {
  volume: number;
  preset: AudioPreset;
  isLeveling: boolean;
  isChanged: boolean;
  isDisabled: boolean;
  onVolumeChange: (percent: number) => void;
  onPresetChange: (preset: AudioPreset) => void;
  onToggleLeveling: () => void;
  onReset: () => void;
}
