import { A } from '@solidjs/router';

import { formatClockMs } from '@/shared/lib/time';
import { paths } from '@/shared/router';
import { Icon } from '@/shared/ui/icon';

import { timecodeStyles } from './Timecode.styles';

interface TimecodeLinkProps {
  meetingId: string;
  ms: number;
}

export function TimecodeLink(props: TimecodeLinkProps) {
  return (
    <A
      class={timecodeStyles()}
      href={paths.meetingMoment(props.meetingId, props.ms)}
    >
      <Icon size={8} name="common:play" />
      {formatClockMs(props.ms)}
    </A>
  );
}
