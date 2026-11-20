import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatRole } from './chat-role.enum';
import { ChatThreadEntity } from './threads/chat-thread.entity';

@Entity({ name: 'chat_messages' })
@Index('IDX_chat_messages_thread_created', ['threadId', 'createdAt'])
export class ChatMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  threadId: string;

  @ManyToOne(() => ChatThreadEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'threadId' })
  thread: ChatThreadEntity;

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
