import { Injectable } from '@nestjs/common';
import { AddToCartDto, UpdateCartDto } from '@/modules/cart/dto/cart.in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from '@/modules/cart/entities/cart.entity';
import { Repository } from 'typeorm';
import { CartException } from '@/exceptions/cart.exception';
import { ProductEntity } from '@/modules/products/entities/product.entity';

type WhereCartType = {
  user: {
    id: string;
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
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    // @InjectRepository(ConsumableEntity)
    // private readonly consumablesRepository: Repository<ConsumableEntity>,
    // @InjectRepository(ProductConsumablesEntity)
    // private readonly productsConsumablesRepository: Repository<ProductConsumablesEntity>,
  ) {}

  private Exception = CartException;

  private async checkProductInCartOrError(where: WhereCartType) {
    const existProductInCart = await this.cartRepository.findOne({ where });

    if (!existProductInCart) {
      throw this.Exception.NotFoundInCart();
    }
  }

  private createWhereCondition({ userId, productId }: CreateWhereConditionDataType): WhereCartType {
    return {
      user: {
        id: userId,
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
    });

    if (!existProduct) {
      throw this.Exception.ProductNotFound();
    }

    const where = this.createWhereCondition({ userId, productId });

    const existProductInCart = await this.cartRepository.findOne({
      where,
    });

    if (existProductInCart) {
      throw this.Exception.AlreadyInCart();
    }

    return this.cartRepository.save({
      ...where,
      count: existProductInCart ? existProductInCart.count + count : count,
    });
  }

  async getCartByUserId(userId: string) {
    const cartProducts = await this.cartRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        product: true,
      },
    });

    //TODO: Вынести в DTO
    return {
      list: cartProducts,
      totalPrice: cartProducts.reduce((totalPrice, { count, product }) => {
        const productTotalPrice = product.price * count;

        return totalPrice + productTotalPrice;
      }, 0),
    };
  }

  async update(userId: string, { count, productId }: UpdateCartDto) {
    const where = this.createWhereCondition({ userId, productId });

    await this.checkProductInCartOrError(where);

    if (!count) {
      return this.cartRepository.delete(where);
    }

    return this.cartRepository.update(where, { count });
  }

  async removeFromCart(userId: string, { productId }: RemoveFromCartDataType) {
    const where = this.createWhereCondition({ userId, productId });

    await this.checkProductInCartOrError(where);

    return this.cartRepository.delete(where);
  }
}
