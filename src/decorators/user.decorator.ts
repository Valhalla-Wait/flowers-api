import { UsersExceptions } from '@/exceptions/users';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const user = ctx.switchToHttp().getRequest().user;

  if (!user) {
    return UsersExceptions.Unauthorized();
  }

  return user;
});
