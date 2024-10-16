import { IS_ADMIN_KEY } from '@/auth/constants';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { AdminJwtGuard } from '@/auth/guards/admin-jwt.guard';

export function Admin() {
  return applyDecorators(SetMetadata(IS_ADMIN_KEY, true), UseGuards(AdminJwtGuard));
}
