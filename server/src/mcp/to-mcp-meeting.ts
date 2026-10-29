import { MeetingOutput } from '../meetings/meeting.output';
import { McpMeeting } from './mcp-meeting';

export const toMcpMeeting = (meeting: MeetingOutput): McpMeeting => ({
  id: meeting.id,
  title: meeting.title,
  source: meeting.source,
  status: meeting.status,
  startedAt: meeting.startedAt,
  durationSec: meeting.durationSec,
  isFavorite: meeting.isFavorite,
});
