import { Module } from '@nestjs/common';
import { DeepgramClientProvider } from './deepgram-client.provider';
import { TranscriptionService } from './transcription.service';

@Module({
  providers: [DeepgramClientProvider, TranscriptionService],
  exports: [DeepgramClientProvider, TranscriptionService],
})
export class TranscriptionModule {}
