import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { UserEntity as UserEntityModel } from 'src/users/user.entity';
import { ActionItemsService } from './action-items.service';
import { UpdateActionItemInput } from './dto/update-action-item.input';
import { ActionItemModel } from './dto/meeting.model';

@Controller('action-items')
@UseGuards(JwtAuthGuard)
export class ActionItemsController {
  constructor(private actionItems: ActionItemsService) {}

  @Get()
  async findAll(@UserEntity() user: UserEntityModel) {
    return this.actionItems.findAllByUser(user.id);
  }

  @Patch(':id')
  async update(
    @UserEntity() user: UserEntityModel,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateActionItemInput,
  ): Promise<ActionItemModel> {
    return this.actionItems.update(id, user.id, input);
  }

  @Delete(':id')
  async remove(
    @UserEntity() user: UserEntityModel,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: boolean }> {
    await this.actionItems.remove(id, user.id);
    return { success: true };
  }
}
