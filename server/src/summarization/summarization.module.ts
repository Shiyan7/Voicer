import { Module } from '@nestjs/common';
import { GeminiModule } from '../gemini/gemini.module';
import { SummarizationService } from './summarization.service';

@Module({
  imports: [GeminiModule],
  providers: [SummarizationService],
  exports: [SummarizationService],
})
export class SummarizationModule {}
