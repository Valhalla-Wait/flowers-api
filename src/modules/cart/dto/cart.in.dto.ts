import { PickType } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class AddToCartDto {
  @IsUUID(4)
  productId: string;

  @IsPositive()
  count: number;
}

export class UpdateCartDto extends PickType(AddToCartDto, ['productId']) {
  @IsNumber()
  count: number;
}
