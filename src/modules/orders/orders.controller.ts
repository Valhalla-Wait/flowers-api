import { Controller, Get, Post, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from '@/modules/orders/orders.service';
import { User } from '@/decorators/user.decorator';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { OrdersQueryDto } from '@/modules/orders/dto/order.in.dto';
import { plainToInstance } from 'class-transformer';
import { OrderOutDto } from '@/modules/orders/dto/order.out.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@User() user: UserEntity) {
    const entity = await this.ordersService.create(user.id);
    return plainToInstance(OrderOutDto, entity);
  }

  @Post('accept/:orderId')
  async acceptOrder(@Param('orderId') orderId: string) {
    await this.ordersService.accept(orderId);
  }

  @Post('complete/:orderId')
  async completeOrder(@Param('orderId') orderId: string) {
    await this.ordersService.complete(orderId);
  }

  @Post('delivery/:orderId')
  async setDeliveryOrder(@Param('orderId') orderId: string) {
    await this.ordersService.delivery(orderId);
  }

  @Delete('cancel/:orderId')
  async cancelOrder(@Param('orderId') orderId: string) {
    await this.ordersService.cancel(orderId);
  }

  @Get()
  getOrdersById(@Query() query: OrdersQueryDto, @User() user: UserEntity) {
    return this.ordersService.getOrdersByUserId(user, query);
  }
}
