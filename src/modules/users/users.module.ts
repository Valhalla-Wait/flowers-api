import { Module } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { UsersController } from '@/modules/users/users.controller';

@Module({
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}
