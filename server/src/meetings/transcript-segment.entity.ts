import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MeetingEntity } from './meeting.entity';

@Index('IDX_transcript_segments_text_trgm', { synchronize: false })
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
