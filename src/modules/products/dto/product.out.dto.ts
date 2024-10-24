import { Exclude, Expose } from 'class-transformer';
import { CreateProductDto } from '@/modules/products/dto/product.in.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ProductOutDto extends CreateProductDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  isAvailable: boolean;
}
