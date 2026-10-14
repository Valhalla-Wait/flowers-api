import { PaginationQueryDto, SortQueryDto } from '@/common/dto/pagination.in.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '@/modules/orders/entities/order.entity';
import { Type } from 'class-transformer';
import { IntersectionType } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class OrdersQueryDto extends IntersectionType(PaginationQueryDto, SortQueryDto) {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsUUID(4)
  @Type(() => IsUUID(4))
  @IsOptional()
  userId?: string;
}

// Упрощённый флоу создания заказа (без регистрации/корзины — только phone).
// NOTE: Временная реализация, позже вернуть полноценный флоу.
export class SimpleOrderProductDto {
  @IsUUID(4)
  productId: string;

  @IsInt()
  @Min(1)
  count: number;
}

export class CreateSimpleOrderDto {
  @IsPhoneNumber('RU')
  phone: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SimpleOrderProductDto)
  products: SimpleOrderProductDto[];
}
