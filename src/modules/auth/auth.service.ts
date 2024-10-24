import { randomUUID } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/modules/users/users.service';
import { UserEntity } from 'src/modules/users/entities/user.entity';

import { AuthException } from 'src/exceptions/auth.exception';

import { TokenType } from 'src/auth/constants';
import envConfig from 'src/config/envConfig';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTokenPayload } from '@/auth/types';
import { LoginUserInDto, ResetPasswordInDto } from '@/modules/auth/dto/auth.in.dto';
import { Passworder } from '@/lib/Passworder';
import { Roles } from '@/modules/users/types';

@Injectable()
export class AuthService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async getTokenPayload(user: UserEntity): Promise<UserTokenPayload> {
    const tokenId = randomUUID();

    return {
      id: user.id,
      tokenId,
    };
  }

  async generateAndUpdateToken(user: UserEntity, tokenType: TokenType): Promise<string> {
    let userTokenPayload: UserTokenPayload | null = null;

    userTokenPayload = await this.getTokenPayload(user);

    if (tokenType === TokenType.ACCESS) {
      await this.usersService.updateLastToken(user, userTokenPayload.tokenId);
    }

    return this.jwtService.signAsync(userTokenPayload, {
      secret: envConfig.jwt.secret,
      expiresIn:
        tokenType === TokenType.REFRESH
          ? envConfig.jwt.refreshExpires
          : envConfig.jwt.accessExpires,
    });
  }

  private async generateTokens(user: UserEntity) {
    const accessToken = await this.generateAndUpdateToken(user, TokenType.ACCESS);
    const refreshToken = await this.generateAndUpdateToken(user, TokenType.REFRESH);

    return { accessToken, refreshToken };
  }

  public async loginUser({ password }: LoginUserInDto) {
    const user = await this.usersRepository.findOneBy({
      role: Roles.ADMIN,
    });

    if (!(await Passworder.validatePassword(password, user.password))) {
      throw AuthException.WrongPassword();
    }

    const tokens = await this.generateTokens(user);

    return { ...tokens, user };
  }

  public async resetPassword({ code, newPassword }: ResetPasswordInDto) {
    if (code !== envConfig.app.code) throw AuthException.WrongCode();

    const hashedPassword = await Passworder.hashPassword(newPassword);

    await this.usersRepository.update(
      {
        role: Roles.ADMIN,
      },
      {
        password: hashedPassword,
      },
    );

    return { message: 'Success' };
  }

  public async registerUser({ password }: LoginUserInDto) {
    const userEntity = this.usersRepository.create({
      firstName: 'admin',
      lastName: 'admin',
      phone: 'not found',
      role: Roles.ADMIN,
      password: await Passworder.hashPassword(password),
    });

    const user = await this.usersRepository.save(userEntity);

    const tokens = await this.generateTokens(user);

    return { ...tokens, user };
  }

  public async logoutUser(user: UserEntity) {
    return this.usersService.updateLastToken(user, null);
  }
}
