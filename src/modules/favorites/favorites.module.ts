import { Module } from '@nestjs/common';
import { FavoritesService } from '@/modules/favorites/favorites.service';
import { FavoritesController } from '@/modules/favorites/favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteEntity } from '@/modules/favorites/entities/favorite.entity';
import { ProductsModule } from '@/modules/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteEntity]), ProductsModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
