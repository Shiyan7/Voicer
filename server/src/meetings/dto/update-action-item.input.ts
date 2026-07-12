import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateActionItemInput {
  @IsOptional()
  @IsBoolean()
  isDone?: boolean;

  @IsOptional()
  @IsString()
  text?: string;
}
