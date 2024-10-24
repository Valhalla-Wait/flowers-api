import { IS_PROTECTED_PUBLIC_KEY, IS_PUBLIC_KEY } from 'src/auth/constants';
import { SetMetadata, applyDecorators } from '@nestjs/common';

export function Public(params?: { withoutAdminProtection: boolean }) {
  return applyDecorators(
    params?.withoutAdminProtection
      ? SetMetadata(IS_PUBLIC_KEY, true)
      : SetMetadata(IS_PROTECTED_PUBLIC_KEY, true),
  );
}
