import { Injectable } from '@nestjs/common';
import { AddToCartDto, UpdateCartDto } from '@/modules/cart/dto/cart.in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from '@/modules/cart/entities/cart.entity';
import { Repository } from 'typeorm';
import { CartException } from '@/exceptions/cart.exception';
import { ProductEntity } from '@/modules/products/entities/product.entity';
import { CartProductEntity } from '@/modules/cart/entities/cartProduct.entity';
import { PaginationQueryDto } from '@/common/dto/pagination.in.dto';
import getPaginationMeta from '@/utils/getPaginationMeta';
import getPaginationParams from '@/utils/getPaginationParams';
import { plainToInstance } from 'class-transformer';
import { ProductCartOutDto } from '@/modules/cart/dto/cart.out.dto';

type WhereCartType = {
  cart: {
    id: string;
    user: {
      id: string;
    };
  };
  product: {
    id: string;
  };
};

type CreateWhereConditionDataType = {
  productId: string;
  userId: string;
};

type RemoveFromCartDataType = Pick<UpdateCartDto, 'productId'>;

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(CartProductEntity)
    private readonly cartProductsRepository: Repository<CartProductEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  private Exception = CartException;

  private async checkProductInCartOrError(where: WhereCartType) {
    const existProductInCart = await this.cartProductsRepository.findOne({
      where,
    });

    if (!existProductInCart) {
      throw this.Exception.NotFoundInCart();
    }
  }

  private async createWhereCondition({
    userId,
    productId,
  }: CreateWhereConditionDataType): Promise<WhereCartType> {
    const userCart = await this.cartRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return {
      cart: {
        id: userCart.id,
        user: {
          id: userId,
        },
      },
      product: {
        id: productId,
      },
    };
  }

  async addToCart(userId: string, { count, productId }: AddToCartDto) {
    const existProduct = await this.productsRepository.findOne({
      where: {
        id: productId,
      },
      relations: {
        productConsumables: {
          consumable: true,
        },
      },
    });

    if (!existProduct) {
      throw this.Exception.ProductNotFound();
    }

    const where = await this.createWhereCondition({ userId, productId });

    const existProductInCart = await this.cartProductsRepository.findOne({
      where,
    });

    if (existProductInCart) {
      throw this.Exception.ProductAlreadyInCart();
    }

    let userCart = await this.cartRepository.findOne({
      where: { ...where.cart },
    });

    if (!userCart) {
      userCart = this.cartRepository.create({ ...where.cart });
      await this.cartRepository.save(userCart);
    }

    const cartProductEntity = this.cartProductsRepository.create({
      ...where,
      cart: userCart,
      count: existProductInCart ? existProductInCart.count + count : count,
    });

    return this.cartProductsRepository.save(cartProductEntity);
  }

  async getCartByUserId(userId: string, query: PaginationQueryDto) {
    const { skip, limit, page } = getPaginationParams(query);

    const [entities, total] = await this.cartProductsRepository.findAndCount({
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
        cart: {
          user: true,
        },
      },
      skip,
      take: limit,
      order: { createdAt: 'ASC' },
    });

    const meta = getPaginationMeta({ total, limit, page });

    // return {
    //   list: plainToInstance(ProductOutDto, entities),
    //   meta,
    // };

    return {
      list: plainToInstance(ProductCartOutDto, entities),
      // TODO: Рефакторинг, вынести в DTO
      totalPrice: entities.reduce((price, { count, product }) => {
        const cartProductTotalPrice = product.price * count;

        return price + cartProductTotalPrice;
      }, 0),
      meta,
    };
  }

  async update(userId: string, { count, productId }: UpdateCartDto) {
    const where = await this.createWhereCondition({ userId, productId });

    await this.checkProductInCartOrError(where);

    if (!count) {
      return this.cartProductsRepository.delete(where);
    }

    return this.cartProductsRepository.update(where, { count });
  }

  async removeFromCart(userId: string, { productId }: RemoveFromCartDataType) {
    const where = await this.createWhereCondition({ userId, productId });

    await this.checkProductInCartOrError(where);

    return this.cartProductsRepository.delete(where);
  }
}
