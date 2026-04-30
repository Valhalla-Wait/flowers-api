import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UsersException } from '@/exceptions/users.exception';
import { Passworder } from '@/lib/Passworder';
import { PaginationQueryDto } from '@/common/dto/pagination.in.dto';
import getPaginationParams from '@/utils/getPaginationParams';
import getPaginationMeta from '@/utils/getPaginationMeta';
import { plainToInstance } from 'class-transformer';
import { UserOutDto } from '@/modules/users/dto/user.out.dto';
import { UpdateUserDto } from '@/modules/users/dto/user.in.dto';

@Injectable()
export class UsersService {
  private Exception = UsersException;

  public constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public async findOneByOrError(where: FindOptionsWhere<UserEntity>, withoutError?: boolean) {
    const foundedUser = await this.usersRepository.findOne({
      where,
    });

    if (!foundedUser && !withoutError) throw this.Exception.NotFound();

    return foundedUser;
  }

  async findAll(query: PaginationQueryDto) {
    const { skip, limit, page } = getPaginationParams(query);

    const [entities, total] = await this.usersRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'ASC' },
    });

    const meta = getPaginationMeta({ total, limit, page });

    // TODO: Вынести генерацию на глобальный уровень + добавить функцию для генерации paginationResponse
    return {
      list: plainToInstance(UserOutDto, entities),
      meta,
    };
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

  public async update(id: string, updateData: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOneByOrError({ id });

    const preparedUpdatedData: Partial<UserEntity> = { ...updateData };

    if (preparedUpdatedData?.password) {
      preparedUpdatedData.password = await Passworder.hashPassword(updateData.password);
    }

    const updatedUser = this.usersRepository.merge(user, preparedUpdatedData);

    return this.usersRepository.save(updatedUser);
  }

  public async remove(id: string): Promise<void> {
    const user = await this.findOneByOrError({ id });
    await this.usersRepository.remove(user);
  }
}
