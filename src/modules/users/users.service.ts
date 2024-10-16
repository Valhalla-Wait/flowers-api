import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/modules/users/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { UsersExceptions } from '@/exceptions/users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  create(data: CreateUserDto) {
    return this.usersRepository.save(data);
  }

  async findByIdOrError(id: string, withoutThrow = false): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {},
    });

    if (!user && !withoutThrow) {
      throw UsersExceptions.UserNotFound();
    }

    return user;
  }

  async findOneById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }
}
