import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsString({ each: true })
  @ApiProperty()
  readonly consumableIds: string[];

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'Photo in base64 format',
  })
  readonly photo: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @Expose()
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isAvailable?: boolean;
}
