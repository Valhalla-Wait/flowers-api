import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import envConfig from '@/config/envConfig';
import { JwtAdminServiceSymbol } from '@/auth/constants';
import { AdminJwtStrategy } from '@/auth/strategies/admin-jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secretOrKeyProvider: () => envConfig.jwt.adminSecret,
      signOptions: { expiresIn: envConfig.jwt.adminExpireTime },
    }),
  ],
  providers: [{ provide: JwtAdminServiceSymbol, useExisting: JwtService }, AdminJwtStrategy],
  exports: [JwtAdminServiceSymbol],
})
export class JwtAdminModule {}
