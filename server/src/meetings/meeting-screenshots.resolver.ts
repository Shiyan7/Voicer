import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FileUpload } from '../file/file-upload';
import { UserEntity } from '../users/user.entity';
import { MeetingScreenshotOutput } from './meeting-screenshot.output';
import { MeetingScreenshotsService } from './meeting-screenshots.service';

@Resolver(() => MeetingScreenshotOutput)
export class MeetingScreenshotsResolver {
  constructor(private readonly screenshots: MeetingScreenshotsService) {}

  @Query(() => [MeetingScreenshotOutput])
  meetingScreenshots(
    @CurrentUser() user: UserEntity,
    @Args('meetingId', { type: () => ID }) meetingId: string,
  ): Promise<MeetingScreenshotOutput[]> {
    return this.screenshots.list(user.id, meetingId);
  }

  @Mutation(() => MeetingScreenshotOutput)
  async meetingAddScreenshot(
    @CurrentUser() user: UserEntity,
    @Args('meetingId', { type: () => ID }) meetingId: string,
    @Args({ name: 'image', type: () => GraphQLUpload }) image: FileUpload,
    @Args('offsetMs', { type: () => Int }) offsetMs: number,
  ): Promise<MeetingScreenshotOutput> {
    return this.screenshots.add(user.id, meetingId, await image, offsetMs);
  }
}
