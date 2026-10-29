import { Field, ObjectType } from '@nestjs/graphql';
import { ApiTokenOutput } from './api-token.output';

@ObjectType()
export class ApiTokenCreatedOutput {
  @Field(() => ApiTokenOutput)
  apiToken: ApiTokenOutput;

  @Field()
  secret: string;
}
