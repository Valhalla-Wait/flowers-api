import { PaginationQueryDto } from '@/common/dto/pagination.in.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

@Exclude()
export class CreateProductDto {
  @Expose()
  @IsString()
  @ApiProperty()
  readonly title: string;

  @Expose()
  @IsNumber()
  @ApiProperty()
  readonly price: number;

  @Expose()
  @IsArray()
  @Type(() => AddProductConsumableDto)
  @ApiProperty()
  readonly consumables: AddProductConsumableDto[];

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Photo in base64 format',
  })
  readonly photo: string;
}

export class AddProductConsumableDto {
  @IsUUID()
  @ApiProperty()
  readonly id: string;

  @IsNumber()
  @ApiProperty()
  readonly requiredCount: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isAvailable?: boolean;
}

export class ProductQueryDto extends PaginationQueryDto {}
