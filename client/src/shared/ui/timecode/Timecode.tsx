import { i18n } from '@/shared/i18n';
import { formatClockMs } from '@/shared/lib/time';
import { Icon } from '@/shared/ui/icon';

import { timecodeStyles } from './Timecode.styles';

interface TimecodeProps {
  ms: number;
  onSeek: (ms: number) => void;
}

export function Timecode(props: TimecodeProps) {
  const label = () => formatClockMs(props.ms);

  return (
    <button
      class={timecodeStyles()}
      type="button"
      aria-label={i18n.t('meetings.seek_to', { time: label() })}
      onClick={() => props.onSeek(props.ms)}
    >
      <Icon size={8} name="common:play" />
      {label()}
    </button>
  );
}
