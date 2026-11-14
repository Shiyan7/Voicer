import { BadRequestException } from '@nestjs/common';
import { FileUpload } from './file-upload';
import { readUpload } from './read-upload';

const MAX_SCREENSHOT_BYTES = 15 * 1024 * 1024;

export const SCREENSHOT_EXTENSION = '.jpg';

export function readScreenshot(upload: FileUpload): Promise<Buffer> {
  if (!upload.mimetype.startsWith('image/')) {
    throw new BadRequestException('Скриншот должен быть изображением');
  }
  return readUpload(upload, MAX_SCREENSHOT_BYTES);
}
