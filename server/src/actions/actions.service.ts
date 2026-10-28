import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async toggleActionItem(userId: string, id: string): Promise<boolean> {
    const actionItem = await this.findOwnedActionItem(userId, id);
    actionItem.isDone = !actionItem.isDone;

    await this.actionItemsRepository.save(actionItem);

    return true;
  }

  private async findOwnedActionItem(
    userId: string,
    id: string,
  ): Promise<ActionItemEntity> {
    const actionItem = await this.actionItemsRepository.findOne({
      where: { id },
      comment: this.getFnName(this.findOwnedActionItem.name),
    });

    if (!actionItem) {
      throw new NotFoundException('Action item не найден');
    }

    if (actionItem.userId !== userId) {
      throw new ForbiddenException();
    }

    return actionItem;
  }

  private serialize(actionItem: ActionItemEntity): ActionItemOutput {
    return {
      id: actionItem.id,
      meetingId: actionItem.meetingId,
      text: actionItem.text,
      isDone: actionItem.isDone,
      speakerIndex: actionItem.speakerIndex,
      atMs: actionItem.atMs,
      createdAt: actionItem.createdAt,
      meetingTitle: actionItem.meeting.title,
      meetingSource: actionItem.meeting.source,
      meetingStartedAt: actionItem.meeting.startedAt,
    };
  }

  private getFnName(name: string): string {
    return `${ActionsService.name}.${name}`;
  }
}
