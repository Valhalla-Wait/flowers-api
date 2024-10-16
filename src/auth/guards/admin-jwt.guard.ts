import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { JwtAccessType } from '@/auth/constants';

@Injectable()
export class AdminJwtGuard extends AuthGuard(JwtAccessType.ADMIN) implements CanActivate {
  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
