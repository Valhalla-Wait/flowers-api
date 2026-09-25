import { Injectable } from '@nestjs/common';
import {
  AddProductConsumableDto,
  CreateProductDto,
  ProductQueryDto,
  UpdateProductDto,
} from '@/modules/products/dto/product.in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '@/modules/products/entities/product.entity';
import { Brackets, FindOptionsOrder, FindOptionsWhere, In, Repository } from 'typeorm';
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

type AddProductConsumableType = {
  productId: string;
  consumables: AddProductConsumableDto[];
};

type RemoveProductConsumableType = Pick<AddProductConsumableType, 'productId'> & {
  consumableIds: string[];
};

//! Зачем?
// type GetProductsQueryOptions = {
//   where?: FindOptionsWhere<ProductEntity> | FindOptionsWhere<ProductEntity>[];
//   order?: FindOptionsOrder<ProductEntity>;
// };

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @InjectRepository(ConsumableEntity)
    private readonly consumablesRepository: Repository<ConsumableEntity>,
    @InjectRepository(ProductConsumableEntity)
    private readonly productsConsumablesRepository: Repository<ProductConsumableEntity>,
  ) {}

  private Exception = ProductsException;

  async findOneByIdOrError(id: string) {
    const founded = await this.productsRepository.findOne({
      where: { id },
      relations: {
        productConsumables: {
          consumable: true,
        },
      },
    });

    if (!founded) {
      throw this.Exception.NotFound();
    }

    return founded;
  }

  async create(createProductDto: CreateProductDto) {
    const productEntity = this.productsRepository.create(createProductDto);
    await this.productsRepository.save(productEntity);

    return this.productsRepository.findOne({
      where: {
        id: productEntity.id,
      },
      relations: {
        productConsumables: {
          consumable: true,
        },
      },
    });
  }

  private async getUserQuery(
    skip: number,
    limit: number,
    options?: {
      ids: string[];
    },
  ) {
    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productConsumables', 'productConsumable')
      .leftJoinAndSelect('productConsumable.consumable', 'consumable');

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

    if (options?.ids) {
      query.andWhere('product.id IN (:...ids)', {
        ids: options.ids,
      });
    }

    return query.skip(skip).take(limit).getManyAndCount();
  }

  private async getAdminQuery(
    skip: number,
    limit: number,
    options?: {
      ids: string[];
      order?: FindOptionsOrder<ProductEntity>;
    },
  ) {
    const where: FindOptionsWhere<ProductEntity> = {};

    if (options) {
      where.id = In(options.ids);
    }

    const data = await this.productsRepository.findAndCount({
      where,
      order: options?.order ?? {
        createdAt: 'ASC',
      },
      relations: {
        productConsumables: {
          consumable: true,
        },
      },
      skip,
      take: limit,
    });

    return data;
  }

  async findAll({ ids, ...query }: ProductQueryDto, user: UserEntity) {
    const { skip, limit, page } = getPaginationParams(query);

    const options: { ids: string[]; order?: FindOptionsOrder<ProductEntity> } = {
      ids: [],
    };

    if (ids) options.ids = ids;

    // TODO: Рефакторинг
    const [entities, total] = await this[
      user?.role === Roles.ADMIN ? 'getAdminQuery' : 'getUserQuery'
    ](skip, limit, { ids });

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
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // TODO: Использовать возвращаемые данные из update для определения наличия записи
    await this.findOneByIdOrError(id);

    const { consumables, ...productUpdatedData } = updateProductDto;

    if (Array.isArray(consumables)) {
      await this.updateProductConsumable({ productId: id, consumables });
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
}
