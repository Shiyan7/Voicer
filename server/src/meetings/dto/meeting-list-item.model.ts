import { BaseModel } from 'src/common/models/base.model';
import { MeetingSource, MeetingStatus } from '../meeting.entity';

export class MeetingListItemModel extends BaseModel {
  userId: string;

  title: string | null;

  source: MeetingSource;

  status: MeetingStatus;

  startedAt: Date;

  endedAt: Date | null;

  durationSec: number | null;

  summary: string | null;

  audioPath: string | null;

  audioSizeBytes: number | null;

  errorMessage: string | null;
}
