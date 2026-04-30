import { IsUUID } from 'class-validator';

export class AddToFavoriteDto {
  @IsUUID(4)
  productId: string;
}
