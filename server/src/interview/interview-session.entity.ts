import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { InterviewLanguage } from './interview-language.enum';
import { InterviewRecommendations } from './interview.types';

@Entity({ name: 'interview_sessions' })
@Index(['userId', 'createdAt'])
export class InterviewSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'varchar', nullable: true })
  title: string | null;

  @Column({ type: 'text', default: '' })
  resumeText: string;

  @Column({ type: 'text', default: '' })
  vacancyText: string;

  @Column({ type: 'text', default: '' })
  cheatSheet: string;

  @Column({ type: 'varchar', default: InterviewLanguage.RU })
  language: InterviewLanguage;

  @Column({ type: 'jsonb' })
  recommendations: InterviewRecommendations;

  @Column({ type: 'timestamptz', nullable: true })
  finishedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
