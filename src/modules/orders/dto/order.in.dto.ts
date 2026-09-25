import { PaginationQueryDto, SortQueryDto } from '@/common/dto/pagination.in.dto';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
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
