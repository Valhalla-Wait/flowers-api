import { Strategy } from 'passport-jwt';
import { Request, Response } from 'express';
import { Injectable } from '@nestjs/common';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';

import { UsersService } from 'src/modules/users/users.service';

import { TokenType } from 'src/auth/constants';
import { AuthService } from 'src/modules/auth/auth.service';
import envConfig from 'src/config/envConfig';
import { UserTokenPayload } from '@/auth/types';
import { setTokenCookies } from '@/utils/set-token-cookies';
import { AuthException } from '@/exceptions/auth.exception';
import { getToken } from '@/utils/get-token';

@Injectable()
export class RefreshJwtStrategy
  extends PassportStrategy(Strategy, TokenType.REFRESH)
  implements AbstractStrategy
{
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
    super({
      secretOrKey: envConfig.jwt.secret,
      jwtFromRequest: (context: Request) => {
        this.response = context.res;
        return getToken(context, TokenType.REFRESH);
      },
    });
  }

  //! Это баг, нельзя общий метод использовать
  // TODO: нужно ли в базе хранить last_access_token_id?
  private response?: Response;

  public async validate({ id }: UserTokenPayload) {
    try {
      const user = await this.usersService.findOneByOrError({ id });

      if (this.response) {
        const accessToken = await this.authService.generateAndUpdateToken(user, TokenType.ACCESS);
        setTokenCookies(this.response, accessToken, TokenType.ACCESS);
      }

      return user;
    } catch (err) {
      throw AuthException.Unauthorized();
    }
  }
}
