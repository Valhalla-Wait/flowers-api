import { Module } from '@nestjs/common';
import { ProductsService } from '@/modules/products/products.service';
import { ProductsController } from '@/modules/products/products.controller';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
