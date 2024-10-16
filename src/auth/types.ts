import { UserEntity } from '@/modules/users/entities/user.entity';

export type UserTokenPayload = Pick<UserEntity, 'id'>;
