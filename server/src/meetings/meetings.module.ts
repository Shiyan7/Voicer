import { BadRequestException, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../storage/storage.module';
import { ActionItemEntity } from './action-item.entity';
import { ActionItemsController } from './action-items.controller';
import { ActionItemsService } from './action-items.service';
import { MeetingEntity } from './meeting.entity';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { TranscriptSegmentEntity } from './transcript-segment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeetingEntity,
      TranscriptSegmentEntity,
      ActionItemEntity,
    ]),
    StorageModule,
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const maxUploadMb = Number(
          configService.get<string>('MAX_UPLOAD_MB') || 500,
        );

        return {
          limits: { fileSize: maxUploadMb * 1024 * 1024 },
          fileFilter: (req, file, callback) => {
            if (file.mimetype.startsWith('audio/')) {
              callback(null, true);
            } else {
              callback(
                new BadRequestException(
                  `Unsupported file type: ${file.mimetype}`,
                ),
                false,
              );
            }
          },
        };
      },
    }),
  ],
  providers: [MeetingsService, ActionItemsService],
  controllers: [MeetingsController, ActionItemsController],
  exports: [MeetingsService],
})
export class MeetingsModule {}
