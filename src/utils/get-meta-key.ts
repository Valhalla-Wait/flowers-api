import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const getMetaKey = (reflector: Reflector, context: ExecutionContext, key: string) => {
  return reflector.getAllAndOverride(key, [context.getHandler(), context.getClass()]);
};
