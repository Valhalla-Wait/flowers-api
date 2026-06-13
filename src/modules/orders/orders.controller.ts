import { Controller, Get, Post, Query, Body, Patch } from '@nestjs/common';
import { OrdersService } from '@/modules/orders/orders.service';
import { User } from '@/decorators/user.decorator';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { OrdersQueryDto, UpdateOrderStatusDto } from '@/modules/orders/dto/order.in.dto';
import { plainToInstance } from 'class-transformer';
import { OrderOutDto } from '@/modules/orders/dto/order.out.dto';
import { ParamUUID } from '@/decorators/paramUuid.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@User() user: UserEntity) {
    const entity = await this.ordersService.create(user.id);
    return plainToInstance(OrderOutDto, entity);
  }

  @Patch(':orderId')
  async updateOrderStatus(
    @ParamUUID('orderId') orderId: string,
    @Body() { status }: UpdateOrderStatusDto,
  ) {
    const entity = await this.ordersService.updateStatus(orderId, status);
    return plainToInstance(OrderOutDto, entity);
  }

  @Get()
  getOrdersById(@Query() query: OrdersQueryDto, @User() user: UserEntity) {
    return this.ordersService.getOrdersByUserId(user, query);
  }
}
