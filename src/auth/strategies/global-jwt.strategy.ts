import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';

import EnvConfig from '@/config/envConfig';
import { JwtAccessType } from '@/auth/constants';

import { UserTokenPayload } from '@/auth/types';
import { UsersService } from '@/modules/users/users.service';
import { UsersExceptions } from '@/exceptions/users';

@Injectable()
export class GlobalJwtStrategy
  extends PassportStrategy(Strategy, JwtAccessType.GLOBAL)
  implements AbstractStrategy
{
  constructor(private readonly usersService: UsersService) {
    super({
      secretOrKey: EnvConfig.jwt.userSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  public async validate(payload: UserTokenPayload) {
    try {
      return await this.usersService.findByIdOrError(payload.id);
    } catch (err) {
      return UsersExceptions.Unauthorized();
    }
  }
}
