import { BadRequestException } from '@nestjs/common';

export function requireText(
  value: string,
  maxLength: number,
  errorMessage: string,
): string {
  const text = value.trim();
  if (!text || text.length > maxLength) {
    throw new BadRequestException(errorMessage);
  }
  return text;
}
