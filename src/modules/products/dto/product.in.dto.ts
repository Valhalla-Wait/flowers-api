import { PaginationQueryDto, SortQueryDto } from '@/common/dto/pagination.in.dto';
import { ApiProperty, ApiPropertyOptional, IntersectionType, PartialType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

@Exclude()
export class CreateProductDto {
  @Expose()
  @IsString()
  @ApiProperty()
  readonly title: string;

  @Expose()
  @IsPositive()
  @ApiProperty()
  readonly price: number;

  @Expose()
  @IsOptional()
  @IsArray()
  @Type(() => AddProductConsumableDto)
  @ApiProperty()
  readonly consumables?: AddProductConsumableDto[];

  @Expose()
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  @ApiProperty({
    description: 'Ids тегов, которые будут привязаны к товару',
  })
  readonly tagIds?: string[];

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

export class AddProductTagsDto {
  @IsArray()
  @IsUUID(4, { each: true })
  @ApiProperty({
    description: 'Ids тегов',
  })
  readonly tagIds: string[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isAvailable?: boolean;
}

// TODO: Сделать отдельное dto под админа
export class ProductQueryDto extends IntersectionType(PaginationQueryDto, SortQueryDto) {
  @IsArray()
  @Type(() => IsUUID(4))
  @IsOptional()
  ids?: string[];

  @IsArray()
  @Type(() => IsUUID(4))
  @IsOptional()
  consumableIds?: string[];

  @IsArray()
  @IsOptional()
  @IsUUID(4, { each: true })
  @ApiPropertyOptional({
    description: 'Ids тегов, по которым фильтруются товары (по всем указанным)',
  })
  tagIds?: string[];

  @IsOptional()
  @IsIn(['title', 'createdAt', 'price'])
  @ApiPropertyOptional({
    description: 'Поле для сортировки товаров. По умолчанию createdAt',
    enum: ['title', 'createdAt', 'price'],
  })
  sortBy?: 'title' | 'createdAt' | 'price';

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Поиск товаров по названию (подстрока, без учёта регистра)',
  })
  search?: string;
}
