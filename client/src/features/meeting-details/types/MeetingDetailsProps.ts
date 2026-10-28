import { JSX } from 'solid-js';

import { ChatSlotParams } from './ChatSlotParams';

export interface MeetingDetailsProps {
  renderChat?: (params: ChatSlotParams) => JSX.Element;
}
