import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';

import EnvConfig from '@/config/envConfig';
import { JwtAccessType } from '@/auth/constants';

@Injectable()
export class AdminJwtStrategy
  extends PassportStrategy(Strategy, JwtAccessType.ADMIN)
  implements AbstractStrategy
{
  constructor() {
    super({
      secretOrKey: EnvConfig.jwt.adminSecret,
      //TODO: Записывать токен в куках
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  public async validate() {
    return true;
  }
}
