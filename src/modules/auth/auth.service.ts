import { randomUUID } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/modules/users/users.service';
import { UserEntity } from 'src/modules/users/entities/user.entity';

import { AuthException } from 'src/exceptions/auth.exception';

import { TokenType } from 'src/auth/constants';
import envConfig from 'src/config/envConfig';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserTokenPayload } from '@/auth/types';
import {
  LoginUserInDto,
  RegisterUserInDto,
  ResetPasswordInDto,
} from '@/modules/auth/dto/auth.in.dto';
import { Passworder } from '@/lib/Passworder';
import { Roles } from '@/modules/users/types';
import { CartEntity } from '@/modules/cart/entities/cart.entity';

@Injectable()
export class AuthService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  private Exception = AuthException;

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

  public async loginUser({ role, password }: LoginUserInDto) {
    const user = await this.usersRepository.findOneBy({
      role: role ?? Roles.USER,
    });

    if (!(await Passworder.validatePassword(password, user.password))) {
      throw this.Exception.WrongPassword();
    }

    const tokens = await this.generateTokens(user);

    return { ...tokens, user };
  }

  public async resetAdminPassword({ code, newPassword }: ResetPasswordInDto) {
    if (code !== envConfig.app.code) throw this.Exception.WrongCode();

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

  public async registerUser({ phone, password }: RegisterUserInDto) {
    const existUser = await this.usersRepository.findOne({
      where: {
        phone,
      },
    });

    if (existUser) {
      throw this.Exception.UserWithPhoneAlreadyExist();
    }

    const userEntity = this.usersRepository.create({
      phone,
      password: await Passworder.hashPassword(password),
    });

    const user = await this.dataSource.transaction(async (manager) => {
      try {
        const createdUser = await manager.save(UserEntity, userEntity);

        const cartEntity = manager.create(CartEntity, {
          user: createdUser,
        });

        await manager.save(CartEntity, cartEntity);

        return createdUser;
      } catch (error) {
        throw this.Exception.RegisterUserError();
      }
    });

    const tokens = await this.generateTokens(user);

    return { ...tokens, user };
  }

  public async logoutUser(user: UserEntity) {
    return this.usersService.updateLastToken(user, null);
  }
}
