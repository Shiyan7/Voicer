import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionItemEntity } from '../actions/action-item.entity';
import { TranscribedSegment } from '../transcription/transcription.types';
import { KeyPointEntity } from './key-point.entity';
import { MeetingEntity } from './meeting.entity';
import { TranscriptSegmentEntity } from './transcript-segment.entity';

@Injectable()
export class MeetingContentService {
  constructor(
    @InjectRepository(MeetingEntity)
    private readonly meetingsRepository: Repository<MeetingEntity>,
    @InjectRepository(TranscriptSegmentEntity)
    private readonly segmentsRepository: Repository<TranscriptSegmentEntity>,
    @InjectRepository(KeyPointEntity)
    private readonly keyPointsRepository: Repository<KeyPointEntity>,
    @InjectRepository(ActionItemEntity)
    private readonly actionItemsRepository: Repository<ActionItemEntity>,
  ) {}

  async findOwned(userId: string, id: string): Promise<MeetingEntity> {
    const meeting = await this.meetingsRepository.findOneBy({ id, userId });
    if (!meeting) throw new NotFoundException('Встреча не найдена');
    return meeting;
  }

  async getSegments(meetingId: string): Promise<TranscribedSegment[]> {
    const segments = await this.segmentsRepository.find({
      where: { meetingId },
      order: { startMs: 'ASC' },
    });

    return segments.map(({ speakerIndex, startMs, endMs, text }) => ({
      speakerIndex,
      startMs,
      endMs,
      text,
    }));
  }

  async getKeyPointTexts(meetingId: string): Promise<string[]> {
    const keyPoints = await this.keyPointsRepository.find({
      where: { meetingId },
      order: { order: 'ASC' },
    });
    return keyPoints.map((keyPoint) => keyPoint.text);
  }

  async getActionItemTexts(meetingId: string): Promise<string[]> {
    const actionItems = await this.actionItemsRepository.find({
      where: { meetingId },
    });
    return actionItems.map((actionItem) => actionItem.text);
  }

  async saveSuggestedQuestions(
    meetingId: string,
    suggestedQuestions: string[],
  ): Promise<void> {
    await this.meetingsRepository.update(meetingId, { suggestedQuestions });
  }
}
