import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfigService from '@/config/ormconfig';

import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { CheckModule } from '@/modules/check/check.module';
import { ProductsModule } from '@/modules/products/products.module';
import { ConsumablesModule } from '@/modules/consumables/consumables.module';
import { CartModule } from '@/modules/cart/cart.module';
import { OrdersModule } from '@/modules/orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),

    AuthModule,
    UsersModule,
    CheckModule,
    ProductsModule,
    ConsumablesModule,
    CartModule,
    OrdersModule,
  ],
})
export class AppModule {}
