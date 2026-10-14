import { Module } from '@nestjs/common';
import { ProductsService } from '@/modules/products/products.service';
import { ProductsController } from '@/modules/products/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@/modules/products/entities/product.entity';
import { ConsumableEntity } from '@/modules/consumables/entities/consumable.entity';
import { ProductConsumableEntity } from '@/modules/products/entities/productConsumables.entity';
import { ProductTagEntity } from '@/modules/products/entities/productTag.entity';
import { TagEntity } from '@/modules/tags/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ConsumableEntity,
      ProductConsumableEntity,
      ProductTagEntity,
      TagEntity,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
