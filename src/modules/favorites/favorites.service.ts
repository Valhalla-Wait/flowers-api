import { Injectable } from '@nestjs/common';
import { AddToFavoriteDto } from '@/modules/favorites/dto/favorite.in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteEntity } from '@/modules/favorites/entities/favorite.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '@/modules/products/products.service';
import { plainToInstance } from 'class-transformer';
import { FavoriteOutDto } from '@/modules/favorites/dto/favorite.out.dto';
import { PaginationQueryDto } from '@/common/dto/pagination.in.dto';
import getPaginationParams from '@/utils/getPaginationParams';
import getPaginationMeta from '@/utils/getPaginationMeta';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favoritesRepository: Repository<FavoriteEntity>,
    private readonly productsService: ProductsService,
  ) {}

  async add(userId: string, { productId }: AddToFavoriteDto) {
    const product = await this.productsService.findOneByIdOrError(productId);

    const favoriteEntity = this.favoritesRepository.create({
      product,
      user: {
        id: userId,
      },
    });

    return this.favoritesRepository.save(favoriteEntity);
  }

  async getUserFavoritesById(userId: string, query: PaginationQueryDto) {
    const { page, skip, limit } = getPaginationParams(query);

    const [entities, total] = await this.favoritesRepository.findAndCount({
      where: {
        user: {
          id: userId,
        },
      },
      skip,
      take: limit,
    });

    const meta = getPaginationMeta({ page, total, limit });

    return {
      list: plainToInstance(FavoriteOutDto, entities),
      meta,
    };
  }

  remove({ productId, userId }: { productId: string; userId: string }) {
    return this.favoritesRepository.delete({
      product: {
        id: productId,
      },
      user: {
        id: userId,
      },
    });
  }
}
