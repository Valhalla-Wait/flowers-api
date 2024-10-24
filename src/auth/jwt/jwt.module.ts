import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { AccessJwtStrategy } from 'src/auth/strategies/access.strategy';
import { RefreshJwtStrategy } from 'src/auth/strategies/refresh.strategy';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    UsersModule,
    JwtModule.register({
      global: true,
      secretOrPrivateKey: process.env.JWT_SECRET || 'JWT_SECRET',
    }),
  ],
  providers: [JwtService, AccessJwtStrategy, RefreshJwtStrategy],
  exports: [JwtService],
})
export class JwtGlobalModule {}
