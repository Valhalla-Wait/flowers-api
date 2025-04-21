import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from '@/modules/cart/cart.service';
import { AddToCartDto, UpdateCartDto } from '@/modules/cart/dto/cart.in.dto';
import { User } from '@/decorators/user.decorator';
import { UserEntity } from '@/modules/users/entities/user.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addToCart(@User() user: UserEntity, @Body() createCartDto: AddToCartDto) {
    return this.cartService.addToCart(user.id, createCartDto);
  }

  @Get()
  getCartByUserId(@User() user: UserEntity) {
    return this.cartService.getCartByUserId(user.id);
  }

  @Patch()
  update(@User() user: UserEntity, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(user.id, updateCartDto);
  }

  @Delete(':productId')
  removeFromCart(@User() user: UserEntity, @Param('productId') productId: string) {
    return this.cartService.removeFromCart(user.id, { productId });
  }
}
