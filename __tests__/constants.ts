import { UserEntity } from '@/modules/users/entities/user.entity';

interface Mocks {
  user: UserEntity;
}

export const mocks: Mocks = {
  user: { firstName: 'John', lastName: 'Wick' } as UserEntity,
};
