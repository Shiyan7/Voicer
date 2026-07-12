import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.use(cookieParser());
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
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  await app.listen(1488);
}

void bootstrap();
