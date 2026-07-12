import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { TranscriptSegmentEntity } from './transcript-segment.entity';
import { ActionItemEntity } from './action-item.entity';

export enum MeetingSource {
  ZOOM = 'zoom',
  MEET = 'meet',
  TEAMS = 'teams',
  TELEGRAM = 'telegram',
  DISCORD = 'discord',
  OTHER = 'other',
  MANUAL = 'manual',
}

export enum MeetingStatus {
  RECORDING = 'recording',
  UPLOADING = 'uploading',
  UPLOADED = 'uploaded',
  TRANSCRIBING = 'transcribing',
  SUMMARIZING = 'summarizing',
  READY = 'ready',
  FAILED = 'failed',
}

@Entity({ name: 'meetings' })
export class MeetingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'enum', enum: MeetingSource, default: MeetingSource.OTHER })
  source: MeetingSource;

  /** BCP-47 language selected in the client when the meeting was created. */
  @Column({ type: 'varchar', length: 16, nullable: true })
  language: string | null;

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

  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @Column({ type: 'varchar', nullable: true })
  audioPath: string | null;

  @Column({
    type: 'bigint',
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => (value === null ? null : Number(value)),
    },
  })
  audioSizeBytes: number | null;

  @Column({ type: 'varchar', nullable: true })
  errorMessage: string | null;

  @OneToMany(() => TranscriptSegmentEntity, (segment) => segment.meeting)
  segments: TranscriptSegmentEntity[];

  @OneToMany(() => ActionItemEntity, (actionItem) => actionItem.meeting)
  actionItems: ActionItemEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
