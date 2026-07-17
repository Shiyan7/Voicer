import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MeetingEntity } from './meeting.entity';

@Entity({ name: 'transcript_segments' })
export class TranscriptSegmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  meetingId: string;

  @ManyToOne(() => MeetingEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meetingId' })
  meeting: MeetingEntity;

  @Column({ type: 'int' })
  speakerIndex: number;

  @Column({ type: 'int' })
  startMs: number;

  @Column({ type: 'int' })
  endMs: number;

  @Column({ type: 'text' })
  text: string;
}
