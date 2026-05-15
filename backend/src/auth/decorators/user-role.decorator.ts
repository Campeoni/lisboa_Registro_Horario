import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    interface UserRoleType {
      role: { name: string };
    }
    const request = ctx.switchToHttp().getRequest<{ user: UserRoleType }>();
    return request.user?.role?.name;
  },
);
