import { Controller, Get, Post, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from '@/modules/orders/orders.service';
import { User } from '@/decorators/user.decorator';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { OrdersQueryDto } from '@/modules/orders/dto/order.in.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@User() user: UserEntity) {
    return this.ordersService.create(user.id);
  }

  @Post(':orderId')
  async acceptOrder(@Param('orderId') orderId: string) {
    await this.ordersService.create(orderId);
  }
  @Post(':orderId')
  async completeOrder(@Param('orderId') orderId: string) {
    await this.ordersService.complete(orderId);
  }
  @Post(':orderId')
  async setDeliveryOrder(@Param('orderId') orderId: string) {
    await this.ordersService.delivery(orderId);
  }
  @Delete(':orderId')
  async cancelOrder(@Param('orderId') orderId: string) {
    await this.ordersService.cancel(orderId);
  }

  @Get()
  findOne(@Query() query: OrdersQueryDto, @User() user: UserEntity) {
    return this.ordersService.getOrdersByUserId(user, query);
  }
}
