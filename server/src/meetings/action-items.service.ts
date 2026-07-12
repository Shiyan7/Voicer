import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionItemEntity } from './action-item.entity';
import { UpdateActionItemInput } from './dto/update-action-item.input';

@Injectable()
export class ActionItemsService {
  constructor(
    @InjectRepository(ActionItemEntity)
    private readonly actionItemsRepository: Repository<ActionItemEntity>,
  ) {}

  async findAllByUser(userId: string) {
    const items = await this.actionItemsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: { meeting: true },
    });

    return items.map(({ meeting, ...item }) => ({
      ...item,
      meetingTitle: meeting?.title ?? null,
    }));
  }

  async update(
    id: string,
    userId: string,
    input: UpdateActionItemInput,
  ): Promise<ActionItemEntity> {
    const actionItem = await this.findOneOwned(id, userId);

    if (input.isDone !== undefined) {
      actionItem.isDone = input.isDone;
    }

    if (input.text !== undefined) {
      actionItem.text = input.text;
    }

    return this.actionItemsRepository.save(actionItem);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOneOwned(id, userId);
    await this.actionItemsRepository.delete({ id });
  }

  private async findOneOwned(
    id: string,
    userId: string,
  ): Promise<ActionItemEntity> {
    const actionItem = await this.actionItemsRepository.findOne({
      where: { id },
    });

    if (!actionItem) {
      throw new NotFoundException('Action item not found');
    }

    if (actionItem.userId !== userId) {
      throw new ForbiddenException();
    }

    return actionItem;
  }
}
