import { Injectable } from '@nestjs/common';

import { UsersService } from '@/modules/users/users.service';
import { TokensService } from '@/modules/tokens/tokens.service';

import { AuthDto } from '@/modules/auth/dto/auth.in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  // TODO: это шаблон
  async auth(data: AuthDto) {
    const user = await this.usersService.create(data);
    const accessToken = await this.tokensService.generateUserAccessToken({ id: user.id });

    return { accessToken, user };
  }
}
