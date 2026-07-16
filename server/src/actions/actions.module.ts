import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionItemEntity } from './action-item.entity';
import { ActionsResolver } from './actions.resolver';
import { ActionsService } from './actions.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActionItemEntity])],
  providers: [ActionsService, ActionsResolver],
})
export class ActionsModule {}
