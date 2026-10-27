import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const LOCAL_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'tauri://localhost',
  'http://tauri.localhost',
  'https://tauri.localhost',
];

const DEFAULT_MAX_UPLOAD_MB = 500;

function configureHttp(
  app: NestExpressApplication,
  config: ConfigService,
): void {
  app.enableCors({
    origin: [...LOCAL_ORIGINS, config.get<string>('CLIENT_URL')],
  });

  const storageDir = config.get<string>('STORAGE_DIR') ?? './storage';
  app.useStaticAssets(join(process.cwd(), storageDir), { prefix: '/storage/' });

  const maxUploadMb =
    Number(config.get('MAX_UPLOAD_MB')) || DEFAULT_MAX_UPLOAD_MB;
  app.use(
    graphqlUploadExpress({
      maxFileSize: maxUploadMb * 1024 * 1024,
      maxFiles: 1,
    }),
  );
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  configureHttp(app, config);
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();

  await app.listen(config.get<number>('PORT'));
}

void bootstrap();
