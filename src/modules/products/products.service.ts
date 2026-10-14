import { Injectable } from '@nestjs/common';
import {
  AddProductConsumableDto,
  CreateProductDto,
  ProductQueryDto,
  UpdateProductDto,
} from '@/modules/products/dto/product.in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '@/modules/products/entities/product.entity';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { ProductsException } from '@/exceptions/products.exception';
import getPaginationParams from '@/utils/getPaginationParams';
import getPaginationMeta from '@/utils/getPaginationMeta';
import { plainToInstance } from 'class-transformer';
import { ProductOutDto } from '@/modules/products/dto/product.out.dto';
import { ConsumableEntity } from '@/modules/consumables/entities/consumable.entity';
import { ConsumablesException } from '@/exceptions/consumables.exception';
import { ProductConsumableEntity } from '@/modules/products/entities/productConsumables.entity';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { Roles } from '@/modules/users/types';
import { ProductTagEntity } from '@/modules/products/entities/productTag.entity';
import { TagEntity } from '@/modules/tags/entities/tag.entity';
import { TagsException } from '@/exceptions/tags.exception';

type AddProductConsumableType = {
  productId: string;
  consumables: AddProductConsumableDto[];
};

type RemoveProductConsumableType = Pick<AddProductConsumableType, 'productId'> & {
  consumableIds: string[];
};

type AddProductTagsType = {
  productId: string;
  tagIds: string[];
};

type RemoveProductTagsType = Pick<AddProductTagsType, 'productId'> & {
  tagIds: string[];
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @InjectRepository(ConsumableEntity)
    private readonly consumablesRepository: Repository<ConsumableEntity>,
    @InjectRepository(ProductConsumableEntity)
    private readonly productsConsumablesRepository: Repository<ProductConsumableEntity>,
    @InjectRepository(ProductTagEntity)
    private readonly productsTagsRepository: Repository<ProductTagEntity>,
    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
  ) {}

  private Exception = ProductsException;

  async findOneByIdOrError(id: string) {
    const founded = await this.productsRepository.findOne({
      where: { id },
      relations: {
        productConsumables: {
          consumable: true,
        },
        productTags: {
          tag: true,
        },
      },
    });

    if (!founded) {
      throw this.Exception.NotFound();
    }

    return founded;
  }

  async create(createProductDto: CreateProductDto) {
    const { tagIds, ...productData } = createProductDto;

    const productEntity = this.productsRepository.create(productData);
    await this.productsRepository.save(productEntity);

    if (Array.isArray(tagIds) && tagIds.length) {
      await this.addTags({
        productId: productEntity.id,
        tagIds,
      });
    }

    return this.findOneByIdOrError(productEntity.id);
  }

  private async getUserQuery(
    skip: number,
    limit: number,
    options: {
      ids: string[];
      tagIds?: string[];
      search?: string;
      sortBy: 'title' | 'createdAt' | 'price';
      sortOrder: 'asc' | 'desc';
    },
  ) {
    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productConsumables', 'productConsumable')
      .leftJoinAndSelect('productConsumable.consumable', 'consumable')
      .leftJoinAndSelect('product.productTags', 'productTag')
      .leftJoinAndSelect('productTag.tag', 'tag');

    query.where(
      new Brackets((qb) => {
        // TODO: Протестить, вроде неактуально, во втором условии дублируются условия
        // .where((qb) => {
        //   const subQuery = qb
        //     .subQuery()
        //     .select('1')
        //     .from('product_consumables', 'pc')
        //     .innerJoin('pc.consumable', 'c')
        //     .where('pc.product_id = product.id')
        //     .andWhere('c.count < pc.requiredCount')
        //     .getQuery();
        //   return `NOT EXISTS (${subQuery})`;
        // })
        qb.where((qbSub) => {
          const existsSubQuery = qbSub
            .subQuery()
            .select('1')
            .from('product_consumables', 'pc')
            .where('pc.product_id = product.id')
            .getQuery();
          return `EXISTS (${existsSubQuery})`;
        }).orWhere('product.isAvailable = true');
      }),
    );

    if (options.ids.length) {
      query.andWhere('product.id IN (:...ids)', {
        ids: options.ids,
      });
    }

    this.applyTagsFilter(query, options.tagIds);

    if (options.search) {
      query.andWhere('product.title ILIKE :search', {
        search: `%${options.search}%`,
      });
    }

    query
      .orderBy(`product.${options.sortBy}`, options.sortOrder === 'asc' ? 'ASC' : 'DESC')
      .skip(skip)
      .take(limit);

    return query.getManyAndCount();
  }

  private async getAdminQuery(
    skip: number,
    limit: number,
    options: {
      ids: string[];
      tagIds?: string[];
      search?: string;
      sortBy: 'title' | 'createdAt' | 'price';
      sortOrder: 'asc' | 'desc';
    },
  ) {
    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productConsumables', 'productConsumable')
      .leftJoinAndSelect('productConsumable.consumable', 'consumable')
      .leftJoinAndSelect('product.productTags', 'productTag')
      .leftJoinAndSelect('productTag.tag', 'tag');

    if (options.ids.length) {
      query.andWhere('product.id IN (:...ids)', {
        ids: options.ids,
      });
    }

    this.applyTagsFilter(query, options.tagIds);

    if (options.search) {
      query.andWhere('product.title ILIKE :search', {
        search: `%${options.search}%`,
      });
    }

    query
      .orderBy(`product.${options.sortBy}`, options.sortOrder === 'asc' ? 'ASC' : 'DESC')
      .skip(skip)
      .take(limit);

    return query.getManyAndCount();
  }

  private applyTagsFilter(query: SelectQueryBuilder<ProductEntity>, tagIds?: string[]) {
    if (!tagIds?.length) {
      return;
    }

    tagIds.forEach((tagId, index) => {
      query.andWhere(
        `EXISTS (
          SELECT 1 FROM product_tags pt
          WHERE pt.product_id = product.id
            AND pt.tag_id = :tagId_${index}
        )`,
        { [`tagId_${index}`]: tagId },
      );
    });
  }

  async findAll(
    { ids, tagIds, sortBy, sort, search, ...query }: ProductQueryDto,
    user: UserEntity,
  ) {
    const { skip, limit, page } = getPaginationParams(query);

    const options: {
      ids: string[];
      tagIds?: string[];
      search?: string;
      sortBy: 'title' | 'createdAt' | 'price';
      sortOrder: 'asc' | 'desc';
    } = {
      ids: [],
      sortBy: sortBy ?? 'createdAt',
      sortOrder: sort ?? 'desc',
    };

    if (ids?.length) options.ids = ids;
    if (tagIds?.length) options.tagIds = tagIds;
    if (search) options.search = search;

    // TODO: Рефакторинг
    const [entities, total] = await this[
      user?.role === Roles.ADMIN ? 'getAdminQuery' : 'getUserQuery'
    ](skip, limit, options);

    const meta = getPaginationMeta({ total, limit, page });

    // TODO: Вынести генерацию на глобальный уровень + добавить функцию для генерации paginationResponse
    return {
      list: plainToInstance(ProductOutDto, entities),
      meta,
    };
  }

  async findOne(id: string) {
    const entity = await this.findOneByIdOrError(id);

    // TODO: Вынести на уровень @Transform
    return {
      ...entity,
      consumables: entity.productConsumables.map(({ consumable, requiredCount }) => ({
        requiredCount,
        ...consumable,
      })),
      tags: (entity.productTags ?? []).map(({ tag }) => ({
        id: tag.id,
        title: tag.title,
      })),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // TODO: Использовать возвращаемые данные из update для определения наличия записи
    await this.findOneByIdOrError(id);

    const { consumables, tagIds, ...productUpdatedData } = updateProductDto;

    if (Array.isArray(consumables)) {
      await this.updateProductConsumable({ productId: id, consumables });
    }

    if (Array.isArray(tagIds)) {
      await this.updateProductTags({ productId: id, tagIds });
    }

    await this.productsRepository.save({
      id,
      ...productUpdatedData,
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOneByIdOrError(id);

    return this.productsRepository.delete({ id });
  }

  // TODO: Вынести логику работы с ProductConsumables в отдельный сервис

  // TODO: Лучше обернуть в транзакцию
  async updateProductConsumable({ consumables, productId }: AddProductConsumableType) {
    const existProductConsumables = await this.productsConsumablesRepository.find({
      where: {
        product: {
          id: productId,
        },
      },
      relations: {
        consumable: true,
      },
    });

    const newProductConsumables = consumables.filter(
      (consumable) =>
        !existProductConsumables.find(
          (existConsumable) => existConsumable.consumable.id === consumable.id,
        ),
    );

    if (newProductConsumables.length) {
      await this.addConsumables({ productId, consumables: newProductConsumables });
    }

    const removedProductConsumables = existProductConsumables.filter(
      (existConsumable) =>
        !consumables.find((consumable) => existConsumable.consumable.id === consumable.id),
    );

    if (removedProductConsumables) {
      await this.removeConsumables({
        productId,
        consumableIds: removedProductConsumables.map(({ consumable }) => consumable.id),
      });
    }
  }

  async addConsumables({ consumables, productId }: AddProductConsumableType) {
    await this.checkConsumablesIsExistOrError(consumables.map(({ id }) => id));

    const entities = consumables.map(({ requiredCount, ...consumable }) =>
      this.productsConsumablesRepository.create({
        product: {
          id: productId,
        },
        consumable,
        requiredCount,
      }),
    );

    await this.productsConsumablesRepository.save(entities);
  }

  async removeConsumables({ consumableIds, productId }: RemoveProductConsumableType) {
    await this.checkConsumablesIsExistOrError(consumableIds);

    await this.productsConsumablesRepository.delete({
      product: {
        id: productId,
      },
      consumable: {
        id: In(consumableIds),
      },
    });
  }

  async checkConsumablesIsExistOrError(consumableIds: string[]) {
    const existConsumablesCount = await this.consumablesRepository.countBy({
      id: In(consumableIds),
    });

    if (consumableIds.length !== existConsumablesCount) {
      // TODO: Сделать более подробную ошибку с ids
      throw ConsumablesException.NotFound();
    }
  }

  // TODO: Вынести логику работы с ProductTags в отдельный сервис

  // TODO: Лучше обернуть в транзакцию
  async updateProductTags({ tagIds, productId }: AddProductTagsType) {
    const existProductTags = await this.productsTagsRepository.find({
      where: {
        product: {
          id: productId,
        },
      },
      relations: {
        tag: true,
      },
    });

    const newTags = tagIds.filter((tagId) => !existProductTags.find(({ tag }) => tag.id === tagId));

    if (newTags.length) {
      await this.addTags({ productId, tagIds: newTags });
    }

    const removedTags = existProductTags.filter(
      ({ tag }) => !tagIds.find((tagId) => tag.id === tagId),
    );

    if (removedTags.length) {
      await this.removeTags({
        productId,
        tagIds: removedTags.map(({ tag }) => tag.id),
      });
    }
  }

  async addTags({ tagIds, productId }: AddProductTagsType) {
    await this.checkTagsIsExistOrError(tagIds);

    const entities = tagIds.map((tagId) =>
      this.productsTagsRepository.create({
        product: {
          id: productId,
        },
        tag: {
          id: tagId,
        },
      }),
    );

    await this.productsTagsRepository.save(entities);
  }

  async removeTags({ tagIds, productId }: RemoveProductTagsType) {
    await this.checkTagsIsExistOrError(tagIds);

    await this.productsTagsRepository.delete({
      product: {
        id: productId,
      },
      tag: {
        id: In(tagIds),
      },
    });
  }

  async checkTagsIsExistOrError(tagIds: string[]) {
    const existTagsCount = await this.tagsRepository.countBy({
      id: In(tagIds),
    });

    if (tagIds.length !== existTagsCount) {
      // TODO: Сделать более подробную ошибку с ids
      throw TagsException.NotFound();
    }
  }
}
