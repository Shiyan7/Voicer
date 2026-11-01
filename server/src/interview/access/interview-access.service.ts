import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterviewSessionEntity } from '../interview-session.entity';

@Injectable()
export class InterviewAccessService {
  constructor(
    @InjectRepository(InterviewSessionEntity)
    private readonly sessionsRepository: Repository<InterviewSessionEntity>,
  ) {}

  isOwned(userId: string, id: string): Promise<boolean> {
    return this.sessionsRepository.existsBy({ id, userId });
  }
}
