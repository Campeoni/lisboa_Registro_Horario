import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    interface UserRoleType {
      roleId: string;
    }
    const request = ctx.switchToHttp().getRequest<{ user: UserRoleType }>();
    return request.user?.roleId;
  },
);
