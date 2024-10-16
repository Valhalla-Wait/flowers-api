import { Type } from '@nestjs/common';

//
// Utility types ↴
//

export type Optional<T> = T | undefined;

export type Mutable<T> = { -readonly [K in keyof T]: T[K] };

//
// Response types ↴
//

export interface ApiPaginationMeta {
  page: number;
  total: number;
  limit: number;
  pages: number;
}

export type ApiResponseWithPagination<T> = {
  list: T[];
  meta: ApiPaginationMeta;
};

//
// Documentation types ↴
//

export type ApiResponseDocumentation = {
  summary?: string;
  type?: Type<unknown>;
  withPagination?: boolean;
};
