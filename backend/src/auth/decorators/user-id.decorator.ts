import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    interface UserIdType {
      id: string;
    }
    const request = ctx.switchToHttp().getRequest<{ user: UserIdType }>();
    return request.user?.id;
  },
);
