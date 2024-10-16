import { IS_PUBLIC_KEY } from '@/auth/constants';
import { SetMetadata, applyDecorators } from '@nestjs/common';

export function Public() {
  return applyDecorators(
    SetMetadata(IS_PUBLIC_KEY, true),
    // TODO: посмотреть установку метаданных
    // SetMetadata('swagger/apiSecurity', ['public']),
  );
}
