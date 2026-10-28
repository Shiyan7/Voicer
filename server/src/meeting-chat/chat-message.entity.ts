import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MeetingEntity } from '../meetings/meeting.entity';
import { ChatRole } from './chat-role.enum';

@Entity({ name: 'meeting_chat_messages' })
@Index(['meetingId', 'createdAt'])
export class ChatMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  meetingId: string;

  @ManyToOne(() => MeetingEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meetingId' })
  meeting: MeetingEntity;

  @Column({ type: 'enum', enum: ChatRole })
  role: ChatRole;

  @Column({ type: 'text', default: '' })
  content: string;

  @Column({ type: 'jsonb', default: [] })
  followUps: string[];

  @Column({ type: 'boolean', default: false })
  isFailed: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
