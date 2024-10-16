import { Module } from '@nestjs/common';

import { JwtAdminModule } from '@/auth/jwt/jwt-admin.module';
import { JwtGlobalModule } from '@/auth/jwt/jwt-global.module';

@Module({
  imports: [JwtAdminModule, JwtGlobalModule],
  exports: [JwtAdminModule, JwtGlobalModule],
})
export class JwtProviderModule {}
