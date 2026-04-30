import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { FavoritesService } from '@/modules/favorites/favorites.service';
import { AddToFavoriteDto } from '@/modules/favorites/dto/favorite.in.dto';
import { User } from '@/decorators/user.decorator';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { PaginationQueryDto } from '@/common/dto/pagination.in.dto';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async addToFavorite(@Body() addToFavoriteDto: AddToFavoriteDto, @User() user: UserEntity) {
    await this.favoritesService.add(user.id, addToFavoriteDto);
  }

  @Get()
  getByUserId(@User() user: UserEntity, @Query() query: PaginationQueryDto) {
    return this.favoritesService.getUserFavoritesById(user.id, query);
  }

  @Delete(':productId')
  async remove(@Param('productId') productId: string, @User() user: UserEntity) {
    await this.favoritesService.remove({
      productId,
      userId: user.id,
    });
  }
}
