import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy, AbstractStrategy } from '@nestjs/passport';

import { TokenType } from 'src/auth/constants';
import { UsersService } from 'src/modules/users/users.service';
import envConfig from 'src/config/envConfig';
import { UserTokenPayload } from '@/auth/types';
import { getToken } from '@/utils/get-token';
import { AuthException } from '@/exceptions/auth.exception';

@Injectable()
export class AccessJwtStrategy
  extends PassportStrategy(Strategy, TokenType.ACCESS)
  implements AbstractStrategy
{
  constructor(private readonly usersService: UsersService) {
    super({
      secretOrKey: envConfig.jwt.secret,
      jwtFromRequest: (context: Request) => {
        return getToken(context, TokenType.ACCESS);
      },
      ignoreExpiration: false,
    });
  }

  public async validate({ id }: UserTokenPayload) {
    try {
      return this.usersService.findOneByOrError({ id });
    } catch (err) {
      throw AuthException.Unauthorized();
    }
  }
}
