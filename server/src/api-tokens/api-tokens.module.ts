import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiTokenEntity } from './api-token.entity';
import { ApiTokensResolver } from './api-tokens.resolver';
import { ApiTokensService } from './api-tokens.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApiTokenEntity])],
  providers: [ApiTokensService, ApiTokensResolver],
  exports: [ApiTokensService],
})
export class ApiTokensModule {}
