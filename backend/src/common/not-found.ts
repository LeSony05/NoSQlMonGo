import { NotFoundException } from '@nestjs/common';

export function throwIfMissing<T>(document: T | null, label: string): T {
  if (!document) {
    throw new NotFoundException(`${label} not found`);
  }

  return document;
}
