import { Module } from '@nestjs/common';
import { PlaybackService } from './playback.service';
import { StorageService } from './storage.service';

@Module({
  providers: [StorageService, PlaybackService],
  exports: [StorageService, PlaybackService],
})
export class StorageModule {}
