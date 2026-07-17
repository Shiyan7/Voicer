import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const storageDir = configService.get<string>('STORAGE_DIR') ?? './storage';
  app.useStaticAssets(join(process.cwd(), storageDir), { prefix: '/storage/' });

  const maxUploadMb = Number(configService.get('MAX_UPLOAD_MB')) || 500;
  app.use(
    graphqlUploadExpress({
      maxFileSize: maxUploadMb * 1024 * 1024,
      maxFiles: 1,
    }),
  );

  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();

  const corsWhitelist = [
    'http://localhost:3000',
    'http://localhost:5173',
    'tauri://localhost',
    'http://tauri.localhost',
    'https://tauri.localhost',
    configService.get<string>('CLIENT_URL'),
  ];

  app.enableCors({
    origin: corsWhitelist,
  });

  await app.listen(configService.get<number>('PORT'));
}

void bootstrap();
