import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UsersException } from '@/exceptions/users.exception';
import { Passworder } from '@/lib/Passworder';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public async findOneByOrError(where: FindOptionsWhere<UserEntity>, withoutError?: boolean) {
    const foundedUser = await this.usersRepository.findOne({
      where,
    });

    if (!foundedUser && !withoutError) throw UsersException.NotFound();

    return foundedUser;
  }

  public async updateUserPassword(id: string, newPassword: string): Promise<UserEntity> {
    const user = await this.findOneByOrError({ id });

    const updatedUser = this.usersRepository.merge(user, {
      password: await Passworder.hashPassword(newPassword),
    });

    return this.usersRepository.save(updatedUser) as Promise<UserEntity>;
  }

  public async updateLastToken(user: UserEntity, tokenId: string | null): Promise<UserEntity> {
    const updatedUser = this.usersRepository.merge(user, {
      lastAccessTokenId: tokenId,
    });

    return this.usersRepository.save(updatedUser);
  }
}
