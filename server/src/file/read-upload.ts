import { BadRequestException } from '@nestjs/common';
import { FileUpload } from './file-upload';

export async function readUpload(
  upload: FileUpload,
  maxBytes: number,
): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of upload.createReadStream()) {
    size += (chunk as Buffer).length;
    if (size > maxBytes) {
      throw new BadRequestException('Файл слишком большой');
    }
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}
