import { Module } from '@nestjs/common';
import { ProductsService } from '@/modules/products/products.service';
import { ProductsController } from '@/modules/products/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@/modules/products/entities/product.entity';
import { ConsumableEntity } from '@/modules/consumables/entities/consumable.entity';
import { ProductConsumablesEntity } from '@/modules/products/entities/productConsumables.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ConsumableEntity, ProductConsumablesEntity])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
