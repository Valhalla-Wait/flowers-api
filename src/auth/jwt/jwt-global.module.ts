import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import envConfig from '@/config/envConfig';
import { JwtGlobalServiceSymbol } from '@/auth/constants';
import { UsersModule } from '@/modules/users/users.module';
import { GlobalJwtStrategy } from '@/auth/strategies/global-jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secretOrKeyProvider: () => envConfig.jwt.userSecret,
      signOptions: { expiresIn: envConfig.jwt.userExpireTime },
    }),
  ],
  providers: [{ provide: JwtGlobalServiceSymbol, useExisting: JwtService }, GlobalJwtStrategy],
  exports: [JwtGlobalServiceSymbol],
})
export class JwtGlobalModule {}
