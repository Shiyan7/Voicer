import { KeyPointEntity } from './key-point.entity';
import { KeyPointOutput } from './key-point.output';
import { MeetingEntity } from './meeting.entity';
import { MeetingOutput } from './meeting.output';
import { TranscriptSegmentEntity } from './transcript-segment.entity';
import { TranscriptSegmentOutput } from './transcript-segment.output';

export function toMeetingOutput(meeting: MeetingEntity): MeetingOutput {
  return {
    id: meeting.id,
    title: meeting.title,
    source: meeting.source,
    audioUrl: meeting.audioUrl,
    status: meeting.status,
    startedAt: meeting.startedAt,
    endedAt: meeting.endedAt,
    durationSec: meeting.durationSec,
    isFavorite: meeting.isFavorite,
    createdAt: meeting.createdAt,
    updatedAt: meeting.updatedAt,
  };
}

export function toSegmentOutput(
  segment: TranscriptSegmentEntity,
): TranscriptSegmentOutput {
  return {
    id: segment.id,
    meetingId: segment.meetingId,
    speakerIndex: segment.speakerIndex,
    startMs: segment.startMs,
    endMs: segment.endMs,
    text: segment.text,
  };
}

export function toKeyPointOutput(keyPoint: KeyPointEntity): KeyPointOutput {
  return {
    id: keyPoint.id,
    meetingId: keyPoint.meetingId,
    text: keyPoint.text,
    atMs: keyPoint.atMs,
    order: keyPoint.order,
  };
}
