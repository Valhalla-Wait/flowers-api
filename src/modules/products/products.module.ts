import { Module } from '@nestjs/common';
import { ProductsService } from '@/modules/products/products.service';
import { ProductsController } from '@/modules/products/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@/modules/products/entities/product.entity';
import { ConsumableEntity } from '@/modules/consumables/entities/consumable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ConsumableEntity])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
