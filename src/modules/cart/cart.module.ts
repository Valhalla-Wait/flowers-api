import { Module } from '@nestjs/common';
import { CartService } from '@/modules/cart/cart.service';
import { CartController } from '@/modules/cart/cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '@/modules/cart/entities/cart.entity';
import { ProductEntity } from '@/modules/products/entities/product.entity';
import { CartProductEntity } from '@/modules/cart/entities/cartProduct.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartProductEntity, ProductEntity])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
