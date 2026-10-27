import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { SummaryStyle } from '../summarization/summary-style.enum';

export enum MeetingStatus {
  RECORDING = 'recording',
  TRANSCRIBING = 'transcribing',
  TRANSCRIBED = 'transcribed',
  SUMMARIZING = 'summarizing',
  READY = 'ready',
  FAILED = 'failed',
}

@Entity({ name: 'meetings' })
@Index(['userId', 'startedAt', 'id'])
export class MeetingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'varchar', nullable: true })
  source: string | null;

  @Column({ type: 'varchar', nullable: true })
  audioUrl: string | null;

  @Column({
    type: 'enum',
    enum: MeetingStatus,
    default: MeetingStatus.RECORDING,
  })
  status: MeetingStatus;

  @Column({ type: 'timestamptz' })
  startedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endedAt: Date | null;

  @Column({ type: 'int', nullable: true })
  durationSec: number | null;

  @Column({ type: 'boolean', default: false })
  isFavorite: boolean;

  @Column({ type: 'enum', enum: SummaryStyle, nullable: true })
  summaryStyle: SummaryStyle | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
