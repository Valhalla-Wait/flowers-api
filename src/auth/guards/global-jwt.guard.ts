import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { TokenType, IS_PUBLIC_KEY, IS_PROTECTED_PUBLIC_KEY } from 'src/auth/constants';
import { getMetaKey } from '@/utils/get-meta-key';

@Injectable()
export class GlobalJwtGuard
  extends AuthGuard([TokenType.ACCESS, TokenType.REFRESH])
  implements CanActivate
{
  constructor(private readonly reflector: Reflector) {
    super();
  }

  private isNotFoundTokens(context: ExecutionContext) {
    const { cookies } = context.switchToHttp().getRequest();

    return !(cookies?.[TokenType.ACCESS] || cookies?.[TokenType.REFRESH]);
  }

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (getMetaKey(this.reflector, context, IS_PUBLIC_KEY)) return true;

    if (
      getMetaKey(this.reflector, context, IS_PROTECTED_PUBLIC_KEY) &&
      this.isNotFoundTokens(context)
    ) {
      return true;
    }

    return super.canActivate(context);
  }
}
