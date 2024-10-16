import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';

import { UserTokenPayload } from '@/auth/types';
import { JwtAdminServiceSymbol, JwtGlobalServiceSymbol } from '@/auth/constants';

@Injectable()
export class TokensService {
  constructor(
    @Inject(JwtAdminServiceSymbol)
    private readonly adminJwtService: JwtService,
    @Inject(JwtGlobalServiceSymbol)
    private readonly globalJwtService: JwtService,
  ) {}

  private _generateAdminAccessToken() {
    return this.adminJwtService.signAsync({});
  }

  public generateUserAccessToken(payload: UserTokenPayload) {
    return this.globalJwtService.signAsync(payload);
  }

  public verifyUserAccessToken(token: string) {
    return this.globalJwtService.verifyAsync<UserTokenPayload>(token);
  }
}
