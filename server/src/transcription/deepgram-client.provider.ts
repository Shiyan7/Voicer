import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeepgramClient } from '@deepgram/sdk';

const MAX_RETRIES = 3;
const TIMEOUT_SECONDS = 1800;

export const DeepgramClientProvider: Provider = {
  provide: DeepgramClient,
  useFactory: (configService: ConfigService): DeepgramClient =>
    new DeepgramClient({
      apiKey: configService.get<string>('DEEPGRAM_API_KEY'),
      timeoutInSeconds: TIMEOUT_SECONDS,
      maxRetries: MAX_RETRIES,
    }),
  inject: [ConfigService],
};
