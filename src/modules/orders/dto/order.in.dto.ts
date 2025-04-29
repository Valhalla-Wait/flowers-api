import { PaginationQueryDto } from '@/common/dto/pagination.in.dto';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OrderStatus } from '@/modules/orders/entities/order.entity';
import { Type } from 'class-transformer';

export class OrdersQueryDto extends PaginationQueryDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsUUID(4)
  @Type(() => IsUUID(4))
  @IsOptional()
  userId?: string;
}
