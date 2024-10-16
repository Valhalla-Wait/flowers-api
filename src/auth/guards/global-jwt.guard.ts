import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { IS_ADMIN_KEY, IS_PUBLIC_KEY, JwtAccessType } from '@/auth/constants';

const validMetaKeys = [IS_PUBLIC_KEY, IS_ADMIN_KEY];

@Injectable()
export class GlobalJwtGuard extends AuthGuard(JwtAccessType.GLOBAL) implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    for (const key of validMetaKeys) {
      const value = this.reflector.getAllAndOverride(key, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (value) return true;
    }

    return super.canActivate(context);
  }
}
