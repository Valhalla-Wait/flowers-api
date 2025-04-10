import { UsersExceptions } from '@/exceptions/users';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const { cookies, user } = ctx.switchToHttp().getRequest();

  if (!user && Object.keys(cookies).length) {
    return UsersExceptions.Unauthorized();
  }

  return user;
});
