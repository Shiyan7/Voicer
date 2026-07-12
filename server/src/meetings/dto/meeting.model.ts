import { BaseModel } from 'src/common/models/base.model';
import { TranscriptSpeaker } from '../transcript-segment.entity';
import { MeetingListItemModel } from './meeting-list-item.model';

export class TranscriptSegmentModel {
  id: string;

  meetingId: string;

  speaker: TranscriptSpeaker;

  startMs: number;

  endMs: number;

  text: string;
}

export class ActionItemModel extends BaseModel {
  meetingId: string;

  userId: string;

  text: string;

  isDone: boolean;
}

export class MeetingModel extends MeetingListItemModel {
  segments: TranscriptSegmentModel[];

  actionItems: ActionItemModel[];
}
