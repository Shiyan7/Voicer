import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MeetingEntity } from './meeting.entity';

export enum TranscriptSpeaker {
  ME = 'me',
  OTHER = 'other',
}

@Entity({ name: 'transcript_segments' })
export class TranscriptSegmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  meetingId: string;

  @ManyToOne(() => MeetingEntity, (meeting) => meeting.segments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'meetingId' })
  meeting: MeetingEntity;

  @Column({ type: 'enum', enum: TranscriptSpeaker })
  speaker: TranscriptSpeaker;

  @Column({ type: 'int' })
  startMs: number;

  @Column({ type: 'int' })
  endMs: number;

  @Column({ type: 'text' })
  text: string;
}
