import { TokenType } from '@/auth/constants';
import { AuthException } from '@/exceptions/auth.exception';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const { cookies, user } = ctx.switchToHttp().getRequest();

  if (!user && (cookies?.[TokenType.ACCESS] || cookies?.[TokenType.REFRESH])) {
    return AuthException.Unauthorized();
  }

  return user;
});
