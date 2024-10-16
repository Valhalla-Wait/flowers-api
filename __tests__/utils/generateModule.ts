import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestingModule, Test } from '@nestjs/testing';

import { UsersService } from '@/modules/users/users.service';
import { UserEntity } from '@/modules/users/entities/user.entity';

import { TestInjects } from '@test/types/test.types';

const baseRepository = {
  save: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
};

const mocks = {
  defaultRepository: baseRepository,

  services: {},
  usersRepository: {
    ...baseRepository,
    create: jest.fn((data) => data as UserEntity),
  },
};

export const generateTestModule = async (injects: TestInjects) => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UsersService,
      {
        provide: getRepositoryToken(UserEntity),
        useValue: mocks.usersRepository,
      },
    ],
  }).compile();

  injects.usersRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  injects.usersService = module.get<UsersService>(UsersService);
};
