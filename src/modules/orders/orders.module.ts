import { Module } from '@nestjs/common';
import { OrdersService } from '@/modules/orders/orders.service';
import { OrdersController } from '@/modules/orders/orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@/modules/orders/entities/order.entity';
import { CartProductEntity } from '@/modules/cart/entities/cartProduct.entity';
import { OrderProductEntity } from '@/modules/orders/entities/orderProduct.entity';
import { ProductEntity } from '@/modules/products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderProductEntity, CartProductEntity, ProductEntity]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
