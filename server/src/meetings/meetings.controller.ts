import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { PlaybackService } from '../storage/playback.service';
import { UserEntity as UserEntityModel } from 'src/users/user.entity';
import { StorageService } from '../storage/storage.service';
import { CreateMeetingInput } from './dto/create-meeting.input';
import { MeetingListItemModel } from './dto/meeting-list-item.model';
import { MeetingModel } from './dto/meeting.model';
import { UpdateMeetingInput } from './dto/update-meeting.input';
import { MeetingsService } from './meetings.service';

const EXT_TO_CONTENT_TYPE: Record<string, string> = {
  '.flac': 'audio/flac',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.m4a': 'audio/mp4',
  '.mp3': 'audio/mpeg',
  '.webm': 'audio/webm',
};

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingsController {
  constructor(
    private meetings: MeetingsService,
    private storage: StorageService,
    private playback: PlaybackService,
  ) {}

  @Post()
  async create(
    @UserEntity() user: UserEntityModel,
    @Body() input: CreateMeetingInput,
  ): Promise<MeetingListItemModel> {
    return this.meetings.create(user.id, input);
  }

  @Get()
  async findAll(
    @UserEntity() user: UserEntityModel,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
    @Query('skip', new ParseIntPipe({ optional: true })) skip?: number,
  ): Promise<MeetingListItemModel[]> {
    return this.meetings.findAllByUser(user.id, { take, skip });
  }

  @Get(':id')
  async findOne(
    @UserEntity() user: UserEntityModel,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MeetingModel> {
    return this.meetings.findOneOwned(id, user.id, true);
  }

  @Patch(':id')
  async update(
    @UserEntity() user: UserEntityModel,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateMeetingInput,
  ): Promise<MeetingListItemModel> {
    return this.meetings.update(id, user.id, input);
  }

  @Delete(':id')
  async remove(
    @UserEntity() user: UserEntityModel,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: boolean }> {
    await this.meetings.remove(id, user.id);
    return { success: true };
  }

  @Post(':id/audio')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(
    @UserEntity() user: UserEntityModel,
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MeetingListItemModel> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.meetings.attachAudio(id, user.id, file);
  }

  @Get(':id/audio')
  async streamAudio(
    @UserEntity() user: UserEntityModel,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const meeting = await this.meetings.findOneOwned(id, user.id);

    if (!meeting.audioPath) {
      throw new NotFoundException('Meeting has no audio');
    }

    const audioPath = await this.playback.getPlaybackPath(meeting.audioPath);

    const stats = await this.storage.stat(audioPath).catch(() => {
      throw new NotFoundException('Audio file not found');
    });

    const fileSize = stats.size;
    const contentType =
      EXT_TO_CONTENT_TYPE[extname(audioPath)] ??
      'application/octet-stream';

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', contentType);

    const range = req.headers.range;
    const rangeMatch = range ? /^bytes=(\d*)-(\d*)$/.exec(range) : null;

    if (rangeMatch) {
      const start = rangeMatch[1] ? parseInt(rangeMatch[1], 10) : 0;
      const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize || start > end) {
        res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
        res.end();
        return;
      }

      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Content-Length', end - start + 1);

      this.storage.getReadStream(audioPath, { start, end }).pipe(res);
      return;
    }

    res.setHeader('Content-Length', fileSize);
    this.storage.getReadStream(audioPath).pipe(res);
  }
}
