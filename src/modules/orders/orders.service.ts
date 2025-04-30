import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, FindOptionsWhere, In, Repository } from 'typeorm';
import { OrderEntity, OrderStatus } from '@/modules/orders/entities/order.entity';
import { OrdersException } from '@/exceptions/orders.exception';
import { CartProductEntity } from '@/modules/cart/entities/cartProduct.entity';
import { OrderProductEntity } from '@/modules/orders/entities/orderProduct.entity';
import { OrdersQueryDto } from '@/modules/orders/dto/order.in.dto';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { Roles } from '@/modules/users/types';
import getPaginationParams from '@/utils/getPaginationParams';
import getPaginationMeta from '@/utils/getPaginationMeta';
import { ProductConsumableEntity } from '@/modules/products/entities/productConsumables.entity';
import { ConsumableEntity } from '@/modules/consumables/entities/consumable.entity';
import { plainToInstance } from 'class-transformer';
import { OrderOutDto, OrderProductOutDto } from '@/modules/orders/dto/order.out.dto';

type ConsumablesCountDataType = Record<
  string,
  {
    requiredCount: number;
    existCount: number;
  }
>;

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    @InjectRepository(OrderProductEntity)
    private readonly ordersProductsRepository: Repository<OrderProductEntity>,
    @InjectRepository(CartProductEntity)
    private readonly cartProductsRepository: Repository<CartProductEntity>,

    private dataSource: DataSource,
  ) {}

  private Exception = OrdersException;

  private calculateRemainderOfConsumables(cartProducts: OrderProductEntity[]) {
    const consumablesCountsByIds: ConsumablesCountDataType = {};

    cartProducts.forEach((cartProduct) => {
      cartProduct.product.productConsumables.forEach((productConsumable) => {
        const consumableId = productConsumable.consumable.id;
        const consumableCount = productConsumable.consumable.count;

        if (!consumablesCountsByIds[consumableId]) {
          consumablesCountsByIds[consumableId] = {
            requiredCount: cartProduct.count * productConsumable.requiredCount,
            existCount: consumableCount,
          };
        } else {
          const productRequiredCountConsumables =
            cartProduct.count * productConsumable.requiredCount;

          consumablesCountsByIds[consumableId].requiredCount =
            consumablesCountsByIds[consumableId].requiredCount + productRequiredCountConsumables;
        }
      });
    });

    return consumablesCountsByIds;
  }

  private async updateConsumablesCount(
    manager: EntityManager,
    orderProducts: OrderProductEntity[],
    orderStatus: OrderStatus.IN_WORK | OrderStatus.CANCELED,
  ) {
    const consumablesCountData = this.calculateRemainderOfConsumables(orderProducts);

    for (const consumableId in consumablesCountData) {
      const existCount = consumablesCountData[consumableId].existCount;
      const requiredCount = consumablesCountData[consumableId].requiredCount;

      let updatedCount = existCount;

      switch (orderStatus) {
        case OrderStatus.IN_WORK:
          updatedCount -= requiredCount;
          break;
        case OrderStatus.CANCELED:
          updatedCount += requiredCount;
          break;
      }

      await manager.update(
        ConsumableEntity,
        {
          id: consumableId,
        },
        {
          count: updatedCount < 0 ? 0 : updatedCount,
        },
      );
    }
  }

  private async createOrder(userId: string, cartProducts: CartProductEntity[]) {
    return this.dataSource.transaction(async (manager) => {
      // ПРОВЕРКА НАЛИЧИЯ НЕОБХОДИМЫХ РАСХОДНИКОВ ДЛЯ ТОВАРОВ
      const productsConsumables = await manager.find(ProductConsumableEntity, {
        where: {
          product: {
            id: In(cartProducts.map(({ product }) => product.id)),
          },
        },
        relations: {
          product: true,
          consumable: true,
        },
      });

      //TODO: Добавить уровень изоляции
      //TODO: Вынести логику с проверкой в сервис продуктов
      const productsWithNotEnoughConsumables = productsConsumables.filter(
        ({ consumable, requiredCount }) => consumable.count < requiredCount,
      );

      // TODO: Реализовать логику перекрывающих друг друга по компонентам продукты.
      // !NOTE:
      // !Пока оставить предупреждение в админку, что в заказе не на все продукты хватит расходников
      // !Решить при телефонном разговоре какие исключить или заменить на другие товары

      // Продукты могут друг друга исключать если имеют общие расходники
      // надо вывести предупреждение на фронте на этапе добавления в корзину с выбором товара
      // const productsWithNotEnoughCommonConsumables: ProductConsumableEntity[][] = [];

      // productsConsumables.forEach((el) => {
      //   let consumableCount = el.consumable.count;

      //   const commonProductsConsumables = productsConsumables.filter(
      //     (productConsumable) => productConsumable.consumable.id === el.consumable.id,
      //   );

      //   commonProductsConsumables.forEach(
      //     (common) => (consumableCount = consumableCount - common.requiredCount),
      //   );

      //   if (consumableCount < 0) {
      //     productsWithNotEnoughCommonConsumables.push(commonProductsConsumables);
      //   }
      // });

      if (productsWithNotEnoughConsumables.length) {
        // TODO: Протестировать
        throw this.Exception.NotEnoughConsumables([
          ...new Set(productsWithNotEnoughConsumables.map((el) => el.product.title)),
        ]);
      }

      // СОЗДАНИЕ ЗАКАЗА
      const orderEntity = manager.create(OrderEntity, {
        user: {
          id: userId,
        },
      });
      await manager.save(orderEntity);

      // ДОБАВЛЕНИЕ ТОВАРОВ В ЗАКАЗ
      const orderProductEntities = manager.create(
        OrderProductEntity,
        cartProducts.map(({ count, product }) => ({
          product,
          order: orderEntity,
          count,
        })),
      );
      await manager.save(orderProductEntities);

      // УДАЛЕНИЕ ТОВАРОВ ИЗ КОРЗИНЫ
      await manager.delete(CartProductEntity, cartProducts);

      return manager.findOne(OrderEntity, {
        where: {
          id: orderEntity.id,
        },
        relations: {
          orderProducts: true,
        },
      });
    });
  }

  async create(userId: string) {
    const productsInCart = await this.cartProductsRepository.find({
      where: {
        cart: {
          user: {
            id: userId,
          },
        },
      },
      relations: {
        product: {
          productConsumables: {
            consumable: true,
          },
        },
      },
    });

    if (!productsInCart.length) {
      throw this.Exception.AddProductsInCartRequired();
    }

    try {
      const createdOrder = await this.createOrder(userId, productsInCart);

      return {
        ...createdOrder,
        totalPrice: createdOrder.orderProducts.reduce((acc, { count, price }) => {
          return acc + count * price;
        }, 0),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      Logger.error(error);
      throw this.Exception.CreateOrderError();
    }
  }

  async accept(orderId: string) {
    try {
      await this.dataSource.transaction(async (manager) => {
        await manager.update(
          OrderEntity,
          {
            id: orderId,
          },
          {
            status: OrderStatus.IN_WORK,
          },
        );

        const orderProducts = await manager.find(OrderProductEntity, {
          where: {
            order: {
              id: orderId,
            },
          },
          relations: {
            product: {
              productConsumables: {
                consumable: true,
              },
            },
          },
        });

        // TODO
        //! Если нехватает расходников на товары, то вывести на фронте уведомление админу при принятии заказа
        //! Оставлена возможность принудительного принятия заказа даже при отсутствии расходников
        await this.updateConsumablesCount(manager, orderProducts, OrderStatus.IN_WORK);
      });
    } catch (error) {
      Logger.error(`ACCEPT ORDER ERROR: ${error}`);

      throw this.Exception.AcceptOrderError();
    }
  }

  async cancel(orderId: string) {
    try {
      await this.dataSource.transaction(async (manager) => {
        await manager.update(
          OrderEntity,
          {
            id: orderId,
          },
          {
            status: OrderStatus.CANCELED,
          },
        );

        const orderProducts = await manager.find(OrderProductEntity, {
          where: {
            order: {
              id: orderId,
            },
          },
          relations: {
            product: {
              productConsumables: {
                consumable: true,
              },
            },
          },
        });

        //! Если нехватает расходников на товары, то вывести на фронте уведомление админу при принятии заказа
        //! Оставлена возможность принудительного принятия заказа даже при отсутствии расходников
        await this.updateConsumablesCount(manager, orderProducts, OrderStatus.CANCELED);
      });
    } catch (error) {
      Logger.error(`CANCEL ORDER ERROR: ${error}`);

      throw this.Exception.CancelOrderError();
    }
  }

  async complete(orderId: string) {
    try {
      await this.ordersRepository.update(
        {
          id: orderId,
        },
        {
          status: OrderStatus.COMPLETED,
        },
      );
    } catch (error) {
      Logger.error(`COMPLETED ORDER ERROR: ${error}`);

      throw this.Exception.CompletedOrderError();
    }
  }

  async delivery(orderId: string) {
    try {
      await this.ordersRepository.update(
        {
          id: orderId,
        },
        {
          status: OrderStatus.DELIVERY,
        },
      );
    } catch (error) {
      Logger.error(`SET DELIVERY ORDER ERROR: ${error}`);

      throw this.Exception.SetDeliveryOrderError();
    }
  }

  async getOrdersByUserId(user: UserEntity, { userId, status, ...pagination }: OrdersQueryDto) {
    const { skip, limit, page } = getPaginationParams(pagination);

    const isAdmin = user.role === Roles.ADMIN;

    const where: FindOptionsWhere<OrderEntity> = isAdmin
      ? {}
      : {
          user: {
            id: user.id,
          },
        };

    if (status) {
      where.status = status;
    }
    if (isAdmin && userId) {
      where.user = {
        id: userId,
      };
    }

    const [entities, total] = await this.ordersRepository.findAndCount({
      where: { ...where },
      relations: {
        orderProducts: {
          product: {
            productConsumables: {
              consumable: true,
            },
          },
        },
      },
      skip,
      take: limit,
    });

    const meta = getPaginationMeta({ total, limit, page });

    return {
      list: plainToInstance(OrderOutDto, entities),
      meta,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
