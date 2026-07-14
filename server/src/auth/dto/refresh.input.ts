import { Field, InputType } from '@nestjs/graphql';
import { IsJWT } from 'class-validator';

@InputType()
export class RefreshInput {
  @Field()
  @IsJWT()
  refreshToken: string;
}
