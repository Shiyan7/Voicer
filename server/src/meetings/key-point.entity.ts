import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MeetingEntity } from './meeting.entity';

@Entity({ name: 'key_points' })
export class KeyPointEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  meetingId: string;

  @ManyToOne(() => MeetingEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meetingId' })
  meeting: MeetingEntity;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'int', nullable: true })
  atMs: number | null;

  @Column({ type: 'int' })
  order: number;
}
