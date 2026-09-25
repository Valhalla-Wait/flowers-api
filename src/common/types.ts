import { ProductEntity } from '@/modules/products/entities/product.entity';
import { Type } from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';

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

export type ApiResponse<T> = T;

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

//TODO: Сделать через declare
export type CustomClassTransformOptions = ClassTransformOptions & { customPrice?: number };

export type MergedCartDataType = {
  success: ProductEntity[];
  failed: ProductEntity[];
};
