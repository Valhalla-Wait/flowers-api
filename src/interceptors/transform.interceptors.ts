import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResponse, ApiResponseWithPagination } from 'src/common/types';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

const isResponseWithPagination = (response): response is ApiResponseWithPagination<unknown> => {
  if (typeof response !== 'object') return false;
  if (!response.meta && !response.data) return false;

  return true;
};

const transformDataToApiResponse = <T>(
  result: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ApiResponse<any> | ApiResponseWithPagination<any> => {
  if (isResponseWithPagination(result)) {
    return result;
  }

  // NOTE: Если метод возвращает список без пагинации,
  // стоит обернуть его в объект типа { <name>: Array<Type> }
  if (Array.isArray(result)) {
    return {
      list: result,
      meta: {
        total: result.length,
      },
    };
  }

  return {
    data: result,
  };
};

@Injectable()
export class FormatResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T> | ApiResponseWithPagination<T>> {
    return next.handle().pipe(map(transformDataToApiResponse));
  }
}
