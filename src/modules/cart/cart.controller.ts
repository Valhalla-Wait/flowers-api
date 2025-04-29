import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CartService } from '@/modules/cart/cart.service';
import { AddToCartDto, UpdateCartDto } from '@/modules/cart/dto/cart.in.dto';
import { User } from '@/decorators/user.decorator';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { PaginationQueryDto } from '@/common/dto/pagination.in.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addToCart(@User() user: UserEntity, @Body() createCartDto: AddToCartDto) {
    await this.cartService.addToCart(user.id, createCartDto);
  }

  @Get()
  getCartByUserId(@User() user: UserEntity, @Query() query: PaginationQueryDto) {
    return this.cartService.getCartByUserId(user.id, query);
  }

  @Patch()
  async update(@User() user: UserEntity, @Body() updateCartDto: UpdateCartDto) {
    await this.cartService.update(user.id, updateCartDto);
  }

  @Delete(':productId')
  async removeFromCart(@User() user: UserEntity, @Param('productId') productId: string) {
    await this.cartService.removeFromCart(user.id, { productId });
  }
}
