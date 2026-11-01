import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FileUpload } from '../file/file-upload';
import { UserEntity } from '../users/user.entity';
import { InterviewAnswerOutput } from './interview-answer.output';
import { InterviewAnswersService } from './interview-answers.service';
import { InterviewSessionOutput } from './interview-session.output';
import { InterviewTurnOutput } from './interview-turn.output';
import { InterviewSessionsService } from './interview-sessions.service';

@Resolver(() => InterviewSessionOutput)
export class InterviewResolver {
  constructor(
    private readonly sessions: InterviewSessionsService,
    private readonly answers: InterviewAnswersService,
  ) {}

  @Mutation(() => InterviewSessionOutput)
  createInterviewSession(
    @CurrentUser() user: UserEntity,
    @Args({ name: 'resume', type: () => GraphQLUpload }) resume: FileUpload,
    @Args('vacancy') vacancy: string,
  ): Promise<InterviewSessionOutput> {
    return this.sessions.create(user.id, resume, vacancy);
  }

  @Query(() => InterviewSessionOutput)
  interviewSession(
    @CurrentUser() user: UserEntity,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<InterviewSessionOutput> {
    return this.sessions.get(user.id, id);
  }

  @Query(() => [InterviewSessionOutput])
  interviewSessions(
    @CurrentUser() user: UserEntity,
  ): Promise<InterviewSessionOutput[]> {
    return this.sessions.list(user.id);
  }

  @Query(() => [InterviewTurnOutput])
  interviewTurns(
    @CurrentUser() user: UserEntity,
    @Args('sessionId', { type: () => ID }) sessionId: string,
  ): Promise<InterviewTurnOutput[]> {
    return this.sessions.turns(user.id, sessionId);
  }

  @Mutation(() => InterviewSessionOutput)
  updateInterviewSession(
    @CurrentUser() user: UserEntity,
    @Args('id', { type: () => ID }) id: string,
    @Args('finished', { nullable: true }) finished?: boolean,
  ): Promise<InterviewSessionOutput> {
    return this.sessions.update(user.id, id, finished);
  }

  @Mutation(() => ID)
  interviewAskScreenshot(
    @CurrentUser() user: UserEntity,
    @Args('sessionId', { type: () => ID }) sessionId: string,
    @Args({ name: 'image', type: () => GraphQLUpload }) image: FileUpload,
  ): Promise<string> {
    return this.answers.askScreenshot(user.id, sessionId, image);
  }

  @Subscription(() => InterviewAnswerOutput, { name: 'interviewAnswer' })
  interviewAnswer(
    @CurrentUser() user: UserEntity,
    @Args('sessionId', { type: () => ID }) sessionId: string,
  ): Promise<AsyncIterator<{ interviewAnswer: InterviewAnswerOutput }>> {
    return this.answers.subscribe(user.id, sessionId);
  }
}
