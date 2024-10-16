import { Module } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';

import { JwtProviderModule } from '@/auth/jwt/jwt.module';
import { UsersModule } from '@/modules/users/users.module';

import { AuthController } from '@/modules/auth/auth.controller';
import { TokensService } from '@/modules/tokens/tokens.service';

@Module({
  imports: [JwtProviderModule, UsersModule],
  providers: [AuthService, TokensService],
  controllers: [AuthController],
})
export class AuthModule {}
