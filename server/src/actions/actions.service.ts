import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionItemEntity } from './action-item.entity';
import { ActionItemOutput } from './action-item.output';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(ActionItemEntity)
    private readonly actionItemsRepository: Repository<ActionItemEntity>,
  ) {}

  async getUserActionItems(userId: string): Promise<ActionItemOutput[]> {
    const actionItems = await this.actionItemsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: { meeting: true },
      comment: this.getFnName(this.getUserActionItems.name),
    });

    return actionItems.map((actionItem) => this.serialize(actionItem));
  }

  async getMeetingActionItems(
    userId: string,
    meetingId: string,
  ): Promise<ActionItemOutput[]> {
    const actionItems = await this.actionItemsRepository.find({
      where: { userId, meetingId },
      order: { createdAt: 'DESC' },
      relations: { meeting: true },
      comment: this.getFnName(this.getMeetingActionItems.name),
    });

    return actionItems.map((actionItem) => this.serialize(actionItem));
  }

  private serialize(actionItem: ActionItemEntity): ActionItemOutput {
    return {
      id: actionItem.id,
      meetingId: actionItem.meetingId,
      text: actionItem.text,
      isDone: actionItem.isDone,
      createdAt: actionItem.createdAt,
      meetingTitle: actionItem.meeting?.title ?? null,
    };
  }

  private getFnName(name: string): string {
    return `${ActionsService.name}.${name}`;
  }
}
