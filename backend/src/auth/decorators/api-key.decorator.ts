import { ApiKeyGuard } from '../guards/api-key.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';

export function AuthApiKey() {
  return applyDecorators(UseGuards(ApiKeyGuard));
}
