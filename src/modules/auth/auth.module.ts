import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersModule } from '@/modules/users/users.module';
import { AuthController } from '@/modules/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { JwtGlobalModule } from '@/auth/jwt/jwt.module';
import { CartModule } from '@/modules/cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UsersModule,
    CartModule,
    forwardRef(() => JwtGlobalModule),
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
