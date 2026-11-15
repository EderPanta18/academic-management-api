// src/shared/decorators/current-user-id.decorator.ts

import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

type AuthenticatedRequest = {
  user?: {
    id: string;
  };
};

export function CurrentUserId(): ParameterDecorator {
  return createParamDecorator((_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const userId = request.user?.id;

    if (!userId) throw new UnauthorizedException('Usuario no autenticado.');

    return userId;
  })();
}
