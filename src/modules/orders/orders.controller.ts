import { Controller, Get, Post, Query, Body, Patch } from '@nestjs/common';
import { OrdersService } from '@/modules/orders/orders.service';
import { User } from '@/decorators/user.decorator';
import { UserEntity } from '@/modules/users/entities/user.entity';
import {
  CreateSimpleOrderDto,
  OrdersQueryDto,
  UpdateOrderStatusDto,
} from '@/modules/orders/dto/order.in.dto';
import { plainToInstance } from 'class-transformer';
import { OrderOutDto } from '@/modules/orders/dto/order.out.dto';
import { ParamUUID } from '@/decorators/paramUuid.decorator';
import { Public } from '@/auth/decorators/is-public';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@User() user: UserEntity) {
    const entity = await this.ordersService.create(user.id);
    return plainToInstance(OrderOutDto, entity);
  }

  // Упрощённый флоу создания заказа — без регистрации/корзины, только phone + товары.
  // NOTE: Временная реализация, позже вернуть полноценный флоу.
  @Public({ withoutAdminProtection: true })
  @Post('simple')
  async createSimpleOrder(@Body() dto: CreateSimpleOrderDto) {
    const entity = await this.ordersService.createSimpleOrder(dto.phone, dto.products);
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
  getOrders(@Query() query: OrdersQueryDto, @User() user: UserEntity) {
    return this.ordersService.getOrders(user, query);
  }
}
